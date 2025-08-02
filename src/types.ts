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
    width: 1181,
    height: 1772,
    positions: [],
    frameImage: '/frames/frame1.png',
  },
  {
    id: 'frame2',
    name: '2번',
    cutCount: 4,
    width: 591,
    height: 1772,
    positions: [],
    frameImage: '/frames/frame2.png',
  },
  {
    id: 'frame3',
    name: '3번',
    cutCount: 2,
    width: 1063,
    height: 2244,
    positions: [],
    frameImage: '/frames/frame3.png',
  },
  {
    id: 'frame4',
    name: '4번',
    cutCount: 2,
    width: 340,
    height: 718,
    positions: [],
    frameImage: '/frames/frame4.png',
  },
  {
    id: 'frame5',
    name: '5번',
    cutCount: 2,
    width: 340,
    height: 718,
    positions: [],
    frameImage: '/frames/frame5.png',
  },
]; 