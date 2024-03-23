import { useCallback, useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function CanvasNode({ data }) {
    const canvas = useRef(null);
    const getDefaultState = useCallback((label) => {
        switch (label) {
            case 'threading':
                return 'sin(UV.x * 4. * PI)';
            case 'treadling':
                return 'sin(UV.y * 4. * PI)';
            case 'tieup':
                return '1. - texture(tieup, UV).r * 255.';
            default:
                return '';
        }        
    });

    const defaultState = getDefaultState(data.label);
    const [swissInput, setSwissInput] = useState(defaultState);

    useEffect(() => {
        try {
            const glsl = SwissGL(canvas.current);

            const tieup = new TextureTarget(glsl.gl, {
                size: [4, 4],
                format: 'r8',
                data: new Uint8Array([
                    1,1,0,0,
                    0,1,1,0,
                    0,0,1,1,
                    1,0,0,1,
                ]),
                tag: 'tieup'
            });

            console.log('LABEL: ', data.label);
            const exportGlsl = glsl(
                {
                    tieup,
                    Inc: `
                        float tie(vec2 uv) {
                            return 1. - texture(tieup, uv).r * 255.;
                        }
                    `,
                    FP: swissInput,
                },
                {
                    size: [16,16],
                    tag: data.label,
                }
            );

            data.exportGlsl = exportGlsl;

            glsl.loop(({ time }) => {
                glsl({
                    time,
                    exportGlsl,
                    FP: `texture(exportGlsl, UV)`
                })
            });

        } catch (e) {
            console.error(e);
        }

    }, [swissInput, data]);

    return (
        <>
            <div className='canvasNode'>
                <label>
                    Text:
                    <br />
                    <input id="text" type="textarea" value={swissInput} onChange={(e) => setSwissInput(e.target.value)} />
                </label>
                <canvas ref={canvas} width="100" height="100" />
            </div>
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: 20 }}
            />
        </>
    );
}