'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface ParticleNetworkProps {
    className?: string;
}

export default function ParticleNetwork({ className = '' }: ParticleNetworkProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);
    const [isReady, setIsReady] = useState(false);
    const warpModeRef = useRef(false);
    const warpSpeedRef = useRef(0);

    // Expose warp function
    const triggerWarp = useCallback(() => {
        warpModeRef.current = true;
        warpSpeedRef.current = 0.5;
    }, []);

    useEffect(() => {
        (window as any).triggerParticleWarp = triggerWarp;
        return () => { delete (window as any).triggerParticleWarp; };
    }, [triggerWarp]);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        const initializeScene = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            if (width === 0 || height === 0) {
                requestAnimationFrame(initializeScene);
                return;
            }

            // Scene
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
            camera.position.z = 100; // Wider view for full-screen particles

            // Renderer
            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);

            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(renderer.domElement);

            // ===== BIG NETWORK PARTICLES (like before) =====
            const networkCount = 120; // More particles for full-screen coverage
            const networkPositions = new Float32Array(networkCount * 3);
            const networkColors = new Float32Array(networkCount * 3);
            const networkSizes = new Float32Array(networkCount);
            const networkVelocities: THREE.Vector3[] = [];

            const colorPalette = [
                new THREE.Color(0x06b6d4), // cyan
                new THREE.Color(0x8b5cf6), // purple
                new THREE.Color(0x10b981), // emerald
                new THREE.Color(0x22d3ee), // light cyan
            ];

            for (let i = 0; i < networkCount; i++) {
                // Spread across entire screen
                networkPositions[i * 3] = (Math.random() - 0.5) * 200;
                networkPositions[i * 3 + 1] = (Math.random() - 0.5) * 150;
                networkPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 30;

                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                networkColors[i * 3] = color.r;
                networkColors[i * 3 + 1] = color.g;
                networkColors[i * 3 + 2] = color.b;

                networkSizes[i] = Math.random() * 5 + 2; // Big particles

                networkVelocities.push(new THREE.Vector3(
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.02
                ));
            }

            const networkGeometry = new THREE.BufferGeometry();
            networkGeometry.setAttribute('position', new THREE.BufferAttribute(networkPositions, 3));
            networkGeometry.setAttribute('color', new THREE.BufferAttribute(networkColors, 3));
            networkGeometry.setAttribute('size', new THREE.BufferAttribute(networkSizes, 1));

            // Glowing particle shader
            const networkVertexShader = `
                attribute float size;
                varying vec3 vColor;
                uniform float warpStrength;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + warpStrength);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `;

            const networkFragmentShader = `
                varying vec3 vColor;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    float glow = exp(-dist * 2.5) * 0.8;
                    gl_FragColor = vec4(vColor, alpha * 0.8 + glow * 0.4);
                }
            `;

            const networkMaterial = new THREE.ShaderMaterial({
                vertexShader: networkVertexShader,
                fragmentShader: networkFragmentShader,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                uniforms: { warpStrength: { value: 0.0 } }
            });

            const networkParticles = new THREE.Points(networkGeometry, networkMaterial);
            scene.add(networkParticles);

            // ===== CONNECTION LINES =====
            const linesMaterial = new THREE.LineBasicMaterial({
                color: 0x06b6d4,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
            });
            let linesGeometry = new THREE.BufferGeometry();
            let lines = new THREE.LineSegments(linesGeometry, linesMaterial);
            scene.add(lines);

            // ===== WARP PARTICLES (smaller, for hyperspace) =====
            const warpCount = 200;
            const warpPositions = new Float32Array(warpCount * 3);
            const warpColors = new Float32Array(warpCount * 3);
            const warpSizes = new Float32Array(warpCount);

            for (let i = 0; i < warpCount; i++) {
                const radius = 20 + Math.random() * 60;
                const theta = Math.random() * Math.PI * 2;
                warpPositions[i * 3] = Math.cos(theta) * radius;
                warpPositions[i * 3 + 1] = Math.sin(theta) * radius;
                warpPositions[i * 3 + 2] = -100 - Math.random() * 300;

                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                warpColors[i * 3] = color.r;
                warpColors[i * 3 + 1] = color.g;
                warpColors[i * 3 + 2] = color.b;

                warpSizes[i] = Math.random() * 2 + 0.5;
            }

            const warpGeometry = new THREE.BufferGeometry();
            warpGeometry.setAttribute('position', new THREE.BufferAttribute(warpPositions, 3));
            warpGeometry.setAttribute('color', new THREE.BufferAttribute(warpColors, 3));
            warpGeometry.setAttribute('size', new THREE.BufferAttribute(warpSizes, 1));

            const warpMaterial = new THREE.ShaderMaterial({
                vertexShader: `
                    attribute float size;
                    varying vec3 vColor;
                    uniform float warpStrength;
                    void main() {
                        vColor = color;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (200.0 / -mvPosition.z) * (1.0 + warpStrength * 3.0);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    uniform float warpStrength;
                    void main() {
                        vec2 center = gl_PointCoord - vec2(0.5);
                        float dist = length(vec2(center.x, center.y * (1.0 - warpStrength * 0.7)));
                        if (dist > 0.5) discard;
                        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                        float brightness = 1.0 + warpStrength * 2.0;
                        gl_FragColor = vec4(vColor * brightness, alpha * warpStrength);
                    }
                `,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                uniforms: { warpStrength: { value: 0.0 } }
            });

            const warpParticles = new THREE.Points(warpGeometry, warpMaterial);
            scene.add(warpParticles);

            // Mouse tracking
            const mouse = { x: 0, y: 0 };
            const handleMouseMove = (event: MouseEvent) => {
                mouse.x = (event.clientX / width) * 2 - 1;
                mouse.y = -(event.clientY / height) * 2 + 1;
            };
            window.addEventListener('mousemove', handleMouseMove);

            // Animation
            let time = 0;
            let frameCount = 0;
            let warpProgress = 0;

            const animate = () => {
                animationRef.current = requestAnimationFrame(animate);
                time += 0.003;
                frameCount++;

                const networkPosAttr = networkGeometry.getAttribute('position');
                const networkPosArray = networkPosAttr.array as Float32Array;
                const warpPosAttr = warpGeometry.getAttribute('position');
                const warpPosArray = warpPosAttr.array as Float32Array;

                // WARP MODE
                if (warpModeRef.current) {
                    warpSpeedRef.current = Math.min(warpSpeedRef.current + 0.15, 12);
                    warpProgress = Math.min(warpProgress + 0.03, 1.0);

                    networkMaterial.uniforms.warpStrength.value = warpProgress;
                    warpMaterial.uniforms.warpStrength.value = warpProgress;
                    linesMaterial.opacity = 0.2 * (1 - warpProgress);

                    // Network particles rush towards camera
                    for (let i = 0; i < networkCount; i++) {
                        networkPosArray[i * 3 + 2] += warpSpeedRef.current * 2;
                        if (networkPosArray[i * 3 + 2] > 100) {
                            networkPosArray[i * 3] = (Math.random() - 0.5) * 200;
                            networkPosArray[i * 3 + 1] = (Math.random() - 0.5) * 150;
                            networkPosArray[i * 3 + 2] = -200 - Math.random() * 100;
                        }
                    }

                    // Warp particles rush forward fast
                    for (let i = 0; i < warpCount; i++) {
                        warpPosArray[i * 3 + 2] += warpSpeedRef.current * 4;
                        if (warpPosArray[i * 3 + 2] > 100) {
                            const radius = 20 + Math.random() * 60;
                            const theta = Math.random() * Math.PI * 2;
                            warpPosArray[i * 3] = Math.cos(theta) * radius;
                            warpPosArray[i * 3 + 1] = Math.sin(theta) * radius;
                            warpPosArray[i * 3 + 2] = -300 - Math.random() * 150;
                        }
                    }
                } else {
                    // NORMAL MODE - gentle floating with connections
                    for (let i = 0; i < networkCount; i++) {
                        networkPosArray[i * 3] += networkVelocities[i].x;
                        networkPosArray[i * 3 + 1] += networkVelocities[i].y + Math.sin(time + i * 0.1) * 0.015;
                        networkPosArray[i * 3 + 2] += networkVelocities[i].z;

                        // Boundary bounce - full screen coverage
                        if (Math.abs(networkPosArray[i * 3]) > 110) networkVelocities[i].x *= -1;
                        if (Math.abs(networkPosArray[i * 3 + 1]) > 85) networkVelocities[i].y *= -1;
                        if (Math.abs(networkPosArray[i * 3 + 2] + 30) > 50) networkVelocities[i].z *= -1;
                    }

                    // Update connection lines every 4 frames
                    if (frameCount % 4 === 0) {
                        const linePositions: number[] = [];
                        const connectionDistance = 25;

                        for (let i = 0; i < networkCount; i++) {
                            for (let j = i + 1; j < networkCount; j++) {
                                const dx = networkPosArray[i * 3] - networkPosArray[j * 3];
                                const dy = networkPosArray[i * 3 + 1] - networkPosArray[j * 3 + 1];
                                const dz = networkPosArray[i * 3 + 2] - networkPosArray[j * 3 + 2];
                                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                                if (dist < connectionDistance) {
                                    linePositions.push(
                                        networkPosArray[i * 3], networkPosArray[i * 3 + 1], networkPosArray[i * 3 + 2],
                                        networkPosArray[j * 3], networkPosArray[j * 3 + 1], networkPosArray[j * 3 + 2]
                                    );
                                }
                            }
                        }

                        linesGeometry.dispose();
                        linesGeometry = new THREE.BufferGeometry();
                        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
                        lines.geometry = linesGeometry;
                    }
                }

                networkPosAttr.needsUpdate = true;
                warpPosAttr.needsUpdate = true;

                // Gentle rotation
                if (!warpModeRef.current) {
                    networkParticles.rotation.x = mouse.y * 0.05 + Math.sin(time) * 0.02;
                    networkParticles.rotation.y = mouse.x * 0.05 + time * 0.01;
                    lines.rotation.copy(networkParticles.rotation);
                }

                renderer.render(scene, camera);
            };

            animate();
            setIsReady(true);

            // Resize
            const handleResize = () => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
            };
            window.addEventListener('resize', handleResize);

            return () => {
                cancelAnimationFrame(animationRef.current);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('resize', handleResize);
                networkGeometry.dispose();
                networkMaterial.dispose();
                warpGeometry.dispose();
                warpMaterial.dispose();
                linesGeometry.dispose();
                linesMaterial.dispose();
                renderer.dispose();
                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            };
        };

        const cleanup = initializeScene();
        return () => { if (cleanup) cleanup(); };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 -z-10 transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'} ${className}`}
            style={{ background: 'transparent', pointerEvents: 'none' }}
        />
    );
}
