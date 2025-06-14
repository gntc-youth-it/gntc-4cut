export interface DetectedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const detectTransparentAreas = async (imageUrl: string): Promise<DetectedArea[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const areas: DetectedArea[] = [];
      const visited = new Set<string>();

      // 투명 픽셀 찾기
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const alpha = data[idx + 3];
          
          if (alpha < 128 && !visited.has(`${x},${y}`)) {
            // 투명 영역의 경계 찾기
            let minX = x;
            let minY = y;
            let maxX = x;
            let maxY = y;
            
            const queue = [[x, y]];
            visited.add(`${x},${y}`);

            while (queue.length > 0) {
              const [currentX, currentY] = queue.shift()!;
              minX = Math.min(minX, currentX);
              minY = Math.min(minY, currentY);
              maxX = Math.max(maxX, currentX);
              maxY = Math.max(maxY, currentY);

              // 4방향 탐색
              const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
              for (const [dx, dy] of directions) {
                const newX = currentX + dx;
                const newY = currentY + dy;
                const key = `${newX},${newY}`;

                if (
                  newX >= 0 && newX < canvas.width &&
                  newY >= 0 && newY < canvas.height &&
                  !visited.has(key)
                ) {
                  const newIdx = (newY * canvas.width + newX) * 4;
                  if (data[newIdx + 3] < 128) {
                    queue.push([newX, newY]);
                    visited.add(key);
                  }
                }
              }
            }

            // 최소 크기 필터링 (노이즈 제거)
            const width = maxX - minX + 1;
            const height = maxY - minY + 1;
            if (width > 50 && height > 50) {
              areas.push({
                x: minX,
                y: minY,
                width,
                height
              });
            }
          }
        }
      }

      resolve(areas);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}; 