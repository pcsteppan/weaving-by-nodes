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
        const [tieup, treadling, threading] = incomingNodes.map((node) => node.data.exportGlsl);
        
        try {
            const glsl = SwissGL(canvas.current);

            data.treadling = treadling;
            glsl.loop(({ time }) => {
                glsl({
                    treadling: treadling,
                    FP: `
                        float a = texture(treadling, UV).r;
                        FOut = vec4(.5,a,a  ,1.);
                    `,
                });
            });

        } catch (e) {
            console.error(e);
        }

    }, [incomingNodes]);

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
