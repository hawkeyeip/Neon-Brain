import React, { useEffect, useRef, useState } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, X, FileText, CheckSquare, Sparkles } from 'lucide-react';

export default function KnowledgeGraph({ notes, tasks, prompts, onSelectNode }) {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const draggedNodeRef = useRef(null);

  // Convert notes, tasks, prompts into unified graph nodes
  const nodesRef = useRef([]);
  const linksRef = useRef([]);

  useEffect(() => {
    const nodes = [];
    const links = [];

    // Add Note Nodes
    notes.forEach((n) => {
      nodes.push({
        id: n.id,
        title: n.title,
        type: 'note',
        category: n.category,
        tags: n.tags || [],
        color: n.color === 'magenta' ? '#ff007f' : n.color === 'emerald' ? '#00ff9d' : n.color === 'amber' ? '#ffb700' : '#00f3ff',
        raw: n,
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 400,
        vx: 0,
        vy: 0,
        radius: 16,
      });
    });

    // Add Task Nodes
    tasks.forEach((t) => {
      nodes.push({
        id: t.id,
        title: t.title,
        type: 'task',
        category: t.category,
        tags: [t.priority, t.category].filter(Boolean),
        color: t.priority === 'high' ? '#ff007f' : '#00ff9d',
        raw: t,
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 400,
        vx: 0,
        vy: 0,
        radius: 14,
      });
    });

    // Add Prompt Nodes
    prompts.forEach((p) => {
      nodes.push({
        id: p.id,
        title: p.title,
        type: 'prompt',
        category: p.category,
        tags: p.tags || [],
        color: '#ff007f',
        raw: p,
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 400,
        vx: 0,
        vy: 0,
        radius: 15,
      });
    });

    // Compute edges based on shared tags & categories
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];

        const sharedTags = n1.tags.filter(t => n2.tags.includes(t));
        const sameCategory = n1.category && n1.category === n2.category;

        if (sharedTags.length > 0 || sameCategory) {
          links.push({
            source: n1.id,
            target: n2.id,
            weight: sharedTags.length + (sameCategory ? 1 : 0),
          });
        }
      }
    }

    nodesRef.current = nodes;
    linksRef.current = links;
  }, [notes, tasks, prompts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 520;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const runPhysics = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;

      // Force simulation (Repulsion between nodes, attraction along links)
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < 180) {
            const force = (180 - dist) / dist * 0.2;
            n1.vx -= dx * force * 0.05;
            n1.vy -= dy * force * 0.05;
            n2.vx += dx * force * 0.05;
            n2.vy += dy * force * 0.05;
          }
        }
      }

      // Link spring attraction
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 120;
        const force = (dist - targetDist) * 0.005;

        source.vx += dx * force;
        source.vy += dy * force;
        target.vx -= dx * force;
        target.vy -= dy * force;
      });

      // Gravity towards center & friction velocity dampening
      nodes.forEach(n => {
        if (n === draggedNodeRef.current) return;
        n.vx *= 0.85;
        n.vy *= 0.85;
        n.x += n.vx;
        n.y += n.vy;

        // Soft pull to origin
        n.x -= n.x * 0.01;
        n.y -= n.y * 0.01;
      });
    };

    const draw = () => {
      runPhysics();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2 + pan.x;
      const centerY = canvas.height / 2 + pan.y;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(zoom, zoom);

      const nodes = nodesRef.current;
      const links = linksRef.current;

      // Render links
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (!source || !target) return;

        const isHighlighted = 
          hoveredNode && (hoveredNode.id === source.id || hoveredNode.id === target.id);

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = isHighlighted ? 'rgba(0, 243, 255, 0.8)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = isHighlighted ? 2 : 1;
        ctx.stroke();
      });

      // Render nodes
      nodes.forEach(n => {
        const isHovered = hoveredNode && hoveredNode.id === n.id;
        const isSelected = selectedNode && selectedNode.id === n.id;

        // Outer glow halo
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + (isHovered ? 6 : 2), 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = isHovered ? 0.4 : 0.15;
        ctx.shadowBlur = isHovered ? 20 : 8;
        ctx.shadowColor = n.color;
        ctx.fill();

        // Core circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0f1d';
        ctx.strokeStyle = n.color;
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.globalAlpha = 1;
        ctx.fill();
        ctx.stroke();

        // Node Title label
        ctx.font = isHovered ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
        ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(241, 245, 249, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(
          n.title.length > 18 ? n.title.slice(0, 16) + '…' : n.title,
          n.x,
          n.y + n.radius + 14
        );
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pan, zoom, hoveredNode, selectedNode]);

  // Pointer event handlers for panning and node dragging
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const centerX = canvas.width / 2 + pan.x;
    const centerY = canvas.height / 2 + pan.y;

    // Convert click coordinates to graph space
    const graphX = (clientX - centerX) / zoom;
    const graphY = (clientY - centerY) / zoom;

    const hitNode = nodesRef.current.find(n => {
      const dx = n.x - graphX;
      const dy = n.y - graphY;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 5;
    });

    if (hitNode) {
      draggedNodeRef.current = hitNode;
      setSelectedNode(hitNode);
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const centerX = canvas.width / 2 + pan.x;
    const centerY = canvas.height / 2 + pan.y;

    const graphX = (clientX - centerX) / zoom;
    const graphY = (clientY - centerY) / zoom;

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = graphX;
      draggedNodeRef.current.y = graphY;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    if (isDraggingRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
      return;
    }

    // Check hover
    const hitNode = nodesRef.current.find(n => {
      const dx = n.x - graphX;
      const dy = n.y - graphY;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 5;
    });
    setHoveredNode(hitNode || null);
  };

  const handleMouseUp = () => {
    draggedNodeRef.current = null;
    isDraggingRef.current = false;
  };

  return (
    <div className="glass-panel p-4 rounded-2xl relative overflow-hidden border border-cyan-500/30">
      
      {/* Top Header & Controls */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Neural Knowledge Graph
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
            {nodesRef.current.length} Nodes Connected
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-white/10 hover:text-cyan-400 text-slate-300 text-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-white/10 hover:text-cyan-400 text-slate-300 text-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-white/10 hover:text-cyan-400 text-slate-300 text-xs"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-[520px] rounded-xl bg-slate-950/90 cursor-grab active:cursor-grabbing border border-white/5"
      />

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 glass-card p-4 rounded-xl border border-cyan-500/40 glow-border-cyan shadow-2xl animate-in fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              {selectedNode.type === 'note' && <FileText className="w-4 h-4 text-cyan-400" />}
              {selectedNode.type === 'task' && <CheckSquare className="w-4 h-4 text-emerald-400" />}
              {selectedNode.type === 'prompt' && <Sparkles className="w-4 h-4 text-pink-400" />}
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                {selectedNode.type}
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="text-sm font-bold text-white mt-1.5">{selectedNode.title}</h4>
          <p className="text-xs text-slate-300/80 mt-1 line-clamp-2">
            {selectedNode.raw.content || selectedNode.raw.currentPrompt || 'Task duty item'}
          </p>

          <div className="flex flex-wrap gap-1 mt-2.5">
            {selectedNode.tags.map(t => (
              <span key={t} className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
