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
            const [tieup, treadling, threading] = incomingNodes
                .map((node) => node.data.exportGlsl)
                .map((exportGlsl) => exportGlsl(glsl));

            console.log('incomingNodes: ', incomingNodes);

            glsl.loop(({ time }) => {
                glsl({
                    time,
                    tieup,
                    treadling,
                    threading,
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
