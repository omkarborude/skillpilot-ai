import { Lesson, RoadmapNode } from '@/types/domain';
export class RoadmapRepository {
 async getTodayPlan(): Promise<Lesson[]> { return [
  { id:'1', title:'Chord Transitions', minutes:10, type:'practice' },
  { id:'2', title:'Strumming Basics', minutes:5, type:'watch' },
  { id:'3', title:'Understanding Rhythm', minutes:3, type:'read' },
  { id:'4', title:'Switch 3 Chords', minutes:2, type:'challenge' }
 ]; }
 async getNodes(): Promise<RoadmapNode[]> { return [
  { id:'start', title:'Getting Started', progress:100 }, { id:'hold', title:'Holding Guitar', progress:100 },
  { id:'chords', title:'Chord Transitions', progress:43 }, { id:'rhythm', title:'Rhythm Patterns', progress:0, locked:true }
 ]; }
}
export const roadmapRepository = new RoadmapRepository();
