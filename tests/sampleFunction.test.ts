import { describe, it, expect } from 'vitest';
import { mockVoiceEntries } from '../src/lib/mockData';
import { processEntries } from '../src/lib/sampleFunction';

describe('processEntries - structured task extraction', () => {
  // Helper function to find specific entries by transcript snippet
  const findEntry = (snippet: string) => {
    const entry = mockVoiceEntries.find(entry => {
      const found = entry.transcript_raw.includes(snippet);
      return found;
    });
    
    if (!entry) {
      console.error('Could not find entry for snippet:', snippet);
      throw new Error(`Entry not found for snippet: ${snippet}`);
    }
    return entry;
  };

  // it('logs mock data contents', () => {
  //   console.log('Mock Voice Entries:', mockVoiceEntries.map(entry => ({
  //     id: entry.id,
  //     transcript: entry.transcript_raw,
  //     tags: entry.tags_user
  //   })));
  // });

  it('handles empty string', () => {
    const emptyEntry = {
      ...mockVoiceEntries[0],
      transcript_raw: '',
      transcript_user: ''
    };
    const result = processEntries([emptyEntry]);
    expect(result.tasks).toEqual([]);
  });

  it('ignores long-term reflection', () => {
    const entry = findEntry("I dream of a peaceful life");
    const result = processEntries([entry]);
    expect(result.tasks).toEqual([]);
  });

  it('extracts visit task', () => {
    const entry = findEntry("Planning to visit my grandmother later this week");
    const result = processEntries([entry]);
    expect(result.tasks[0]?.text.toLowerCase()).toContain("visit my grandmother");
    expect(result.tasks[0]?.dueDate?.toLowerCase()).toContain("this week");
  });

  it('ignores doomscrolling reflection', () => {
    const entry = findEntry("Kept scrolling through my phone again");
    const result = processEntries([entry]);
    expect(result.tasks).toEqual([]);
  });

  it('ignores emotional entry', () => {
    const entry = findEntry("This relationship makes me happy");
    const result = processEntries([entry]);
    expect(result.tasks).toEqual([]);
  });

  it('extracts dentist task', () => {
    const entry = findEntry("Tomorrow I'm going to the dentist");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("dentist");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("tomorrow");
  });

  it('extracts training course start', () => {
    const entry = findEntry("I plan to start that new training course tomorrow");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("training course");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("tomorrow");
  });

  it('extracts personal statement writing', () => {
    const entry = findEntry("I'm finally sitting down to write my personal statement tomorrow");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("personal statement");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("tomorrow");
  });

  it('extracts meal prepping plan', () => {
    const entry = findEntry("Tomorrow I'm meal prepping for the week");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("meal prepping");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("tomorrow");
  });

  it('extracts finish sculpture', () => {
    const entry = findEntry("I'm setting aside time tomorrow to finish that sculpture");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("sculpture");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("tomorrow");
  });

  it('extracts no-sugar challenge', () => {
    const entry = findEntry("Tomorrow is the day I start my no-sugar challenge");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("no-sugar");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("tomorrow");
  });

  it('extracts grocery shopping', () => {
    const entry = findEntry("I'm going grocery shopping tomorrow to restock essentials");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("grocery shopping");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("tomorrow");
  });

  it('extracts call with mentor', () => {
    const entry = findEntry("I scheduled a long overdue call with my mentor for tomorrow");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("call with my mentor");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("tomorrow");
  });

  it('extracts writing resume', () => {
    const entry = findEntry("I'm writing my resume from scratch tomorrow");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("resume");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("tomorrow");
  });

  it('extracts doctor appointment', () => {
    const entry = findEntry("I have a doctor's appointment scheduled for tomorrow morning");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("doctor");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("tomorrow");
  });

  it('extracts decluttering closet', () => {
    const entry = findEntry("This weekend I'm planning to declutter my closet");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("declutter");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("weekend");
  });

  it('extracts paint living room', () => {
    const entry = findEntry("I'm going to paint the living room sometime this week");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("paint the living room");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("this week");
  });

  it('extracts deep cleaning house', () => {
    const entry = findEntry("I've blocked off Thursday to deep clean the house");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("clean");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("thursday");
  });

  it('extracts batch blog posts', () => {
    const entry = findEntry("I'm going to batch some blog posts over the next few days");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("blog posts");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("next few days");
  });

  it('extracts hotel booking reminder', () => {
    const entry = findEntry("I've set a reminder to book the hotel by Wednesday");
    const result = processEntries([entry]);
    expect(result.tasks[0].text.toLowerCase()).toContain("book the hotel");
    expect(result.tasks[0].dueDate?.toLowerCase()).toContain("wednesday");
  });

  // it('counts reflection tag correctly', () => {
  //   const result = processEntries(mockVoiceEntries)
  //   expect(result.tagFrequencies.reflection).toBe(mockVoiceEntries.length)
  // })
});