'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ThreeCvHero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x818cf8, 2, 20);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // Create 3 floating CV Document Cards
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    const geometry = new THREE.PlaneGeometry(4.2, 5.8);

    // Texture Generator function for realistic resume document look
    const createCVTexture = (title: string, sub: string, color: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 724;
      const ctx = canvas.getContext('2d')!;
      
      // White paper background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 724);

      // Header bar
      ctx.fillStyle = color;
      ctx.fillRect(40, 50, 220, 24);
      
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText(title, 40, 110);

      ctx.fillStyle = '#64748b';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(sub, 40, 135);

      // Divider line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 155);
      ctx.lineTo(472, 155);
      ctx.stroke();

      // Content dummy text lines
      ctx.fillStyle = '#94a3b8';
      for (let y = 180; y < 660; y += 22) {
        const w = 150 + Math.sin(y) * 120 + (y % 4 === 0 ? 80 : 0);
        ctx.fillRect(40, y, Math.min(w, 430), 8);
      }

      return new THREE.CanvasTexture(canvas);
    };

    const textures = [
      createCVTexture('ALEX MORGAN', 'Senior Frontend Engineer', '#0284c7'),
      createCVTexture('TANVIR HASAN', 'Computer Science Graduate', '#0d9488'),
      createCVTexture('SARAH CHEN', 'Product Designer & UX Specialist', '#6366f1'),
    ];

    const cards: THREE.Mesh[] = [];
    const positions = [
      { x: 0, y: 0, z: 0, rx: 0.1, ry: -0.15 },
      { x: -2.2, y: -0.6, z: -1.8, rx: 0.05, ry: 0.25 },
      { x: 2.2, y: 0.6, z: -1.2, rx: -0.1, ry: -0.2 },
    ];

    positions.forEach((pos, idx) => {
      const material = new THREE.MeshStandardMaterial({
        map: textures[idx],
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.rotation.x = pos.rx;
      mesh.rotation.y = pos.ry;
      cardGroup.add(mesh);
      cards.push(mesh);
    });

    // Mouse Parallax movement
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating rotation & parallax response
      cardGroup.rotation.y = THREE.MathUtils.lerp(cardGroup.rotation.y, mouseX * 0.3, 0.05);
      cardGroup.rotation.x = THREE.MathUtils.lerp(cardGroup.rotation.x, -mouseY * 0.3, 0.05);

      cards.forEach((card, i) => {
        card.position.y = positions[i].y + Math.sin(elapsedTime * 1.5 + i) * 0.15;
        card.rotation.z = Math.sin(elapsedTime * 0.8 + i) * 0.03;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (reducedMotion) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        <div className="w-64 h-80 bg-white rounded-lg shadow-2xl p-4 flex flex-col justify-between transform -rotate-3">
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-sky-600 rounded"></div>
            <div className="h-3 w-1/2 bg-slate-300 rounded"></div>
            <div className="h-1 w-full bg-slate-200 mt-4"></div>
            <div className="space-y-1 mt-2">
              <div className="h-2 w-full bg-slate-200 rounded"></div>
              <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
              <div className="h-2 w-4/6 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-center font-mono">Modern CV Preview</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-[450px] relative cursor-grab active:cursor-grabbing flex items-center justify-center"
    />
  );
};
