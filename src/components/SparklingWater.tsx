import { useEffect, useRef } from 'react';

interface SparklingWaterProps {
  className?: string;
  reversed?: boolean; // 控制气泡上升方向，true 为向下（翻转）
  visible?: boolean; // 控制动效是否显示
}

export const SparklingWater = ({ 
  className = '', 
  reversed = false,
  visible = true 
}: SparklingWaterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !visible) return;

    const container = containerRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    container.appendChild(canvas);

    // 气泡配置
    const particles = 60;
    const minRadius = 5;
    const maxRadius = 20;
    const speed = 0.01;
    const x = width / particles;

    // 气泡数组
    const Bubbles: Array<{
      x: number;
      y: number;
      r: number;
      speed: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particles; i++) {
      Bubbles.push({
        x: i * x,
        y: reversed ? Math.random() * height : height * Math.random(),
        r: minRadius + Math.random() * (maxRadius - minRadius),
        speed: 10 * Math.random(),
        alpha: 0
      });
    }

    // 绘制气泡
    function bubble() {
      ctx!.clearRect(0, 0, width, height);
      
      for (let i = 0; i < Bubbles.length; i++) {
        const b = Bubbles[i];
        
        ctx!.beginPath();
        ctx!.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
        
        // 根据位置计算透明度
        if (reversed) {
          // 翻转模式：底部出现，向上消失
          b.alpha = 0.5 * ((height - b.y) / height);
        } else {
          // 正常模式：底部更透明，顶部更清晰
          b.alpha = 0.5 * (b.y / height);
        }
        
        b.speed += speed;
        
        // 白色边框
        ctx!.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx!.stroke();
        
        // 渐变填充 - 浅蓝色气泡
        ctx!.fillStyle = `hsla(203, 75%, 69%, ${b.alpha})`;
        ctx!.fill();
        
        // 气泡移动
        if (reversed) {
          // 翻转模式：气泡向下移动
          b.y += b.speed;
        } else {
          // 正常模式：气泡向上移动
          b.y -= b.speed;
        }
        
        // 重置位置
        if (reversed) {
          // 翻转模式：超出底部重置到顶部
          if (b.y > height) {
            b.y = -b.r;
            b.speed = Math.random() * 5;
          }
        } else {
          // 正常模式：超出顶部重置到底部
          if (b.y < 0) {
            b.y = height;
            b.speed = Math.random() * 5;
          }
        }
      }
    }

    // 动画循环
    function draw() {
      bubble();
      window.requestAnimationFrame(draw);
    }

    // 调整大小
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);
    draw();

    // 清理
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeChild(canvas);
    };
  }, [visible, reversed]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 ${className}`}
      style={{
        background: 'linear-gradient(to top, #c8e8f8, #fff)',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease'
      }}
    />
  );
};