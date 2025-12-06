import { useMemo, useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Maximize2, Minimize2 } from 'lucide-react';
import { INSTITUTIONS } from '../../data/institutions';

const KnowledgeGraph = () => {
    const graphRef = useRef<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (isExpanded) {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            } else if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [isExpanded]);

    const data = useMemo(() => {
        const nodes: any[] = [];
        const links: any[] = [];
        const domainSet = new Set<string>();
        const toolSet = new Set<string>();

        // 1. Add Institution Nodes
        INSTITUTIONS.forEach(inst => {
            nodes.push({
                id: inst.id,
                name: inst.name,
                group: 'institution',
                val: 20 // Size
            });

            // 2. Collect Domains
            if (inst.domains) {
                Object.keys(inst.domains).forEach(domain => {
                    domainSet.add(domain);
                    links.push({
                        source: inst.id,
                        target: `domain-${domain}`,
                        value: 1
                    });
                });
            }

            // 3. Collect Tools
            if (inst.tools) {
                inst.tools.forEach(tool => {
                    toolSet.add(tool.name);
                    links.push({
                        source: inst.id,
                        target: `tool-${tool.name}`,
                        value: 1
                    });
                });
            }
        });

        // 4. Add Domain Nodes
        domainSet.forEach(domain => {
            nodes.push({
                id: `domain-${domain}`,
                name: domain,
                group: 'domain',
                val: 15
            });
        });

        // 5. Add Tool Nodes
        toolSet.forEach(tool => {
            nodes.push({
                id: `tool-${tool}`,
                name: tool,
                group: 'tool',
                val: 10
            });
        });

        return { nodes, links };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-xl transition-all duration-300 ${isExpanded
                ? 'fixed inset-0 z-50 w-screen h-screen rounded-none'
                : 'relative w-full h-[600px]'
                }`}
        >
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 bg-slate-800/80 text-white rounded-md border border-slate-600 hover:bg-slate-700 backdrop-blur-sm transition-colors"
                    title={isExpanded ? "Exit Full Screen" : "Enter Full Screen"}
                >
                    {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
            </div>

            <div className="absolute top-4 left-4 z-10 bg-slate-800/80 p-3 rounded-md border border-slate-600 backdrop-blur-sm pointer-events-none select-none">
                <h3 className="text-white font-bold text-sm mb-2">Graph Legend</h3>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#4f46e5]"></span>
                        <span className="text-xs text-slate-300">Institution</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                        <span className="text-xs text-slate-300">Domain</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                        <span className="text-xs text-slate-300">Tool</span>
                    </div>
                </div>
            </div>

            <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={data}
                nodeLabel="name"
                nodeColor={(node: any) => {
                    switch (node.group) {
                        case 'institution': return '#4f46e5'; // Indigo
                        case 'domain': return '#10b981';      // Emerald
                        case 'tool': return '#f59e0b';        // Amber
                        default: return '#94a3b8';
                    }
                }}
                linkColor={() => '#334155'}
                nodeRelSize={6}
                linkWidth={1}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                backgroundColor="#0f172a" // Slate 900
                cooldownTicks={100}
                onEngineStop={() => graphRef.current?.zoomToFit(400)}
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    // const textWidth = ctx.measureText(label).width;
                    // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    if (node.group === 'institution') {
                        ctx.fillStyle = 'rgba(79, 70, 229, 0.1)';
                    }

                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
                    ctx.fillStyle = node.group === 'institution' ? '#4f46e5' : node.group === 'domain' ? '#10b981' : '#f59e0b';
                    ctx.fill();

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#e2e8f0'; // Slate 200
                    if (globalScale > 1.5 || node.group === 'institution') {
                        ctx.fillText(label, node.x, node.y + node.val + 2);
                    }
                }}
                nodePointerAreaPaint={(node: any, color, ctx) => {
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
                    ctx.fill();
                }}
            />
        </div>
    );
};

export default KnowledgeGraph;
