'use client';

import { useEffect, useRef } from 'react';

export default function RadarLayer({
  yaw = 0, // 좌우 회전 (도)
  range = 45, // 레이더 범위 (도)
  opacity = 0.3, // 투명도 설정
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ✅ WebGL 컨텍스트 생성 (배경 투명 설정)
    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) return;
    glRef.current = gl;

    // ✅ 배경을 투명하게 설정
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ✅ WebGL Shader 초기화
    const vertexShaderSource = `
      attribute vec2 a_position;
      uniform mat3 u_matrix;
      void main() {
          gl_Position = vec4(u_matrix * vec3(a_position, 1.0), 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
          gl_FragColor = u_color;
      }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // ✅ 레이더 부채꼴 좌표 설정
    const radarVertices = [];
    const segments = 30; // 부채꼴을 부드럽게 만들기 위한 세그먼트 수
    radarVertices.push(0, 0); // 중심점
    for (let i = -range / 2; i <= range / 2; i += range / segments) {
      const angle = (yaw + i) * (Math.PI / 180);
      radarVertices.push(Math.cos(angle), Math.sin(angle));
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(radarVertices),
      gl.STATIC_DRAW,
    );

    const a_position = gl.getAttribLocation(shaderProgram, 'a_position');
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

    // ✅ 색상 설정
    const u_color = gl.getUniformLocation(shaderProgram, 'u_color');
    gl.uniform4f(u_color, 0.0, 1.0, 0.0, opacity); // 녹색 반투명

    // ✅ 부채꼴 그리기
    function drawRadar() {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, radarVertices.length / 2);
    }

    drawRadar();

    return () => {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(shaderProgram);
    };
  }, [yaw, range, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        zIndex = 10,
      }}
    />
  );
}
