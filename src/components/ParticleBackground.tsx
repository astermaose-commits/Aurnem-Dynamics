import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

export function BlackHoleBackground({ isDescending }: { isDescending?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDescendingRef = useRef(isDescending);

  useEffect(() => {
    isDescendingRef.current = isDescending;
  }, [isDescending]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    
    // Deep abyssal fog to blend the disk into the background
    scene.fog = new THREE.FogExp2(0x030305, 0.0006);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
    // Start at the edge of the vortex
    camera.position.set(0, 0, 1500);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create Organic Fluid / Smoke
    const particleCount = 50000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const colorSapphire = new THREE.Color(0x0F172A); // Dark Sapphire
    const colorCyan = new THREE.Color(0x06b6d4); // Magic Cyan
    const colorWine = new THREE.Color(0x5e1929); // Ashy Red Wine
    const colorDark = new THREE.Color(0x030305);   // Background

    for (let i = 0; i < particleCount; i++) {
        // Organic distribution using spherical coordinates with noise
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        
        // Spread them out in a long tube/cloud
        const radius = 20 + Math.pow(Math.random(), 2) * 1500;
        const z = (Math.random() - 0.5) * 6000;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = z;

        // Assign colors based on distance and randomness
        let mixedColor;
        const colorRand = Math.random();
        if (radius < 200) {
            mixedColor = colorDark.clone().lerp(colorSapphire, Math.random());
        } else if (colorRand < 0.6) {
            mixedColor = colorSapphire.clone().lerp(colorCyan, Math.random() * 0.5);
        } else if (colorRand < 0.9) {
            mixedColor = colorCyan.clone().lerp(colorDark, Math.random());
        } else {
            mixedColor = colorWine.clone().lerp(colorSapphire, Math.random());
        }
        
        // Occasional bright flashes
        if(Math.random() > 0.99) mixedColor = new THREE.Color(0x06b6d4); 
        if(Math.random() > 0.995) mixedColor = new THREE.Color(0x991B1B); // Rare red flashes

        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;

        sizes[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for better control over particle size and fading
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uFocusMode: { value: 0.0 }, // 0 = normal, 1 = focused
            uMousePos: { value: new THREE.Vector3(0, 0, 0) }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float uFocusMode;
            uniform float uTime;
            uniform vec3 uMousePos;

            void main() {
                vColor = color;
                // Dim colors slightly in focus mode
                vColor = mix(vColor, vColor * 0.3, uFocusMode);
                
                vec3 pos = position;
                
                // Organic fluid movement (smoke/filaments)
                float t = uTime * 0.5;
                pos.x += sin(t + pos.y * 0.002 + pos.z * 0.001) * 100.0;
                pos.y += cos(t + pos.x * 0.002 + pos.z * 0.001) * 100.0;

                // Mouse repulsion (Gravitational Anomaly)
                float dist = distance(pos, uMousePos);
                if (dist < 500.0) {
                    float force = (500.0 - dist) / 500.0;
                    vec3 dir = normalize(pos - uMousePos);
                    pos += dir * force * 150.0;
                }

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (400.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                // Soft circular particles
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                float alpha = 1.0 - (dist * 2.0);
                gl_FragColor = vec4(vColor, alpha * 0.8);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Post-Processing (Bloom)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.05;
    bloomPass.strength = 2.5; // Stronger glow for cyan particles
    bloomPass.radius = 1.2;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Mouse Interactivity
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event: MouseEvent) => {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Focus Mode State
    let isFocused = false;
    let focusTransition = 0; // 0 to 1

    const handleFocus = () => { isFocused = true; };
    const handleBlur = () => { isFocused = false; };
    
    window.addEventListener('terminal-focus', handleFocus);
    window.addEventListener('terminal-blur', handleBlur);

    // Resize Event
    const handleResize = () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // GSAP Scroll Animation: Travel forward through the vortex
    const scrollAnimation = gsap.to(camera.position, {
        z: -1500, // Travel deep into the Z-axis
        ease: "none",
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5
        }
    });

    // Animation Loop
    let animationFrameId: number;
    let time = 0;
    let descendVelocity = 0;

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Handle Focus Mode Transition
        if (isFocused && focusTransition < 1) {
            focusTransition += 0.02;
        } else if (!isFocused && focusTransition > 0) {
            focusTransition -= 0.02;
        }
        
        // Base rotation speed modifier (slows down to 10% when focused)
        const speedModifier = 1.0 - (focusTransition * 0.9);
        
        time += 0.01 * speedModifier;
        material.uniforms.uTime.value = time;
        material.uniforms.uFocusMode.value = focusTransition;

        // Update Mouse Position in World Space for Shader
        // Assuming camera looks down -Z, map mouse to a plane in front of camera
        const vector = new THREE.Vector3(mouseX / windowHalfX, -mouseY / windowHalfY, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = 1500; // Fixed distance in front of camera instead of z=0
        const pos = camera.position.clone().add(dir.multiplyScalar(distance * 0.5)); // Place anomaly halfway
        material.uniforms.uMousePos.value.copy(pos);

        // Update particles
        const positionsAttr = geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Move particles slightly forward to create endless effect
            positionsAttr[i3 + 2] += 2 * speedModifier;
            
            // Slowly rotate the whole cloud
            const x = positionsAttr[i3];
            const y = positionsAttr[i3 + 1];
            positionsAttr[i3] = x * Math.cos(0.001 * speedModifier) - y * Math.sin(0.001 * speedModifier);
            positionsAttr[i3 + 1] = x * Math.sin(0.001 * speedModifier) + y * Math.cos(0.001 * speedModifier);

            // Wrap particles relative to camera position to ensure they are visible everywhere
            while (positionsAttr[i3 + 2] > camera.position.z + 1500) {
                positionsAttr[i3 + 2] -= 6000;
            }
            while (positionsAttr[i3 + 2] < camera.position.z - 4500) {
                positionsAttr[i3 + 2] += 6000;
            }
        }
        geometry.attributes.position.needsUpdate = true;

        // Handle Descend Animation
        if (isDescendingRef.current) {
            if (scrollAnimation) scrollAnimation.kill();
            descendVelocity = Math.min(descendVelocity + 0.5, 100); // Cap velocity
            camera.position.z -= descendVelocity;
            // Add some rotation for the vortex effect
            camera.rotation.z += descendVelocity * 0.0001;
        } else {
            // Camera Parallax (subtle)
            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.01;
            camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.01;
            camera.lookAt(camera.position.x, camera.position.y, camera.position.z - 1000);
        }

        composer.render();
    };
    animate();

    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('terminal-focus', handleFocus);
        window.removeEventListener('terminal-blur', handleBlur);
        cancelAnimationFrame(animationFrameId);
        scrollAnimation.kill();
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        composer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
}
