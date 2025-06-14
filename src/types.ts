export interface Frame {
  id: string;
  name: string;
  cutCount: number;
  width: number;
  height: number;
  positions: { x: number; y: number; width: number; height: number; angle: number }[];
  frameImage: string;
}

export const frames: Frame[] = [
  {
    id: 'frame1',
    name: '1번',
    cutCount: 4,
    width: 400,
    height: 1200,
    positions: [],
    frameImage: '/frames/frame1.png',
  },
  {
    id: 'frame2',
    name: '2번',
    cutCount: 4,
    width: 400,
    height: 1200,
    positions: [],
    frameImage: '/frames/frame2.png',
  },
  {
    id: 'frame3',
    name: '3번',
    cutCount: 2,
    width: 600,
    height: 1200,
    positions: [],
    frameImage: '/frames/frame3.png',
  },
]; 