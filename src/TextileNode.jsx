import { useCallback, useEffect, useRef, useState } from 'react';
import { Handle, Position, getIncomers, useStoreApi, useNodeId, useNodes, useEdges } from 'reactflow';

export default function CanvasNode({ data }) {
    const canvas = useRef(null);

    const nodes = useNodes();
    const edges = useEdges();
    const selfId = useNodeId();

    const incomingNodes = getIncomers(
        nodes.filter((node) => node.id === selfId)[0],
        nodes,
        edges
    );
        
    useEffect(() => {
        
        try {
            const glsl = SwissGL(canvas.current);
            const [tieup, threading, treadling] = incomingNodes
                .map((node) => {
                    const label = node.data.label;
                    const tex = glsl({
                        FP: '1.,0.,0.,1.'
                    }, {tag: label})
                    
                    const incomingCanvas = node.data.canvas;
                    tex.copyCanvas(incomingCanvas);
                    
                    tex.refresh = () => tex.copyCanvas(incomingCanvas);

                    return tex;
                });

            glsl.loop(({ time }) => {
                tieup.refresh();
                treadling.refresh();
                threading.refresh();

                glsl({
                    time,
                    tieup,
                    threading,
                    treadling,
                    FP: `texture(tieup, vec2(texture(threading, UV).r, texture(treadling, UV).r))`,
                });
            });

        } catch (e) {
            console.error(e);
        }

    }, [incomingNodes, data]);

    return (
        <>
            <div className='textileNode'>
                <canvas ref={canvas} width="400" height="400" />
            </div>
            <Handle
                type="target"
                position={Position.Left}
                id="tieup"
                style={{ top: 20 }}
            />
            <Handle
                type="target"
                position={Position.Left}
                id="treadling"
                style={{ top: 40 }}
            />
            <Handle
                type="target"
                position={Position.Left}
                id="threading"
                style={{ top: 60 }}
            />
        </>
    );
}
