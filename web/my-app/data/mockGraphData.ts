export const mockGraphData = {
  nodes: [
    // Central Root Node
    { id: 'root', name: 'My Universe', type: 'root', color: '#ffffff', val: 40 },

    // Courses (Large, Bold Colors)
    { id: 'math18', name: 'MATH 18', type: 'course', color: '#ef4444', val: 24 }, // Red
    { id: 'cse101', name: 'CSE 101', type: 'course', color: '#3b82f6', val: 24 }, // Blue
    { id: 'cogs10', name: 'COGS 10', type: 'course', color: '#10b981', val: 24 }, // Emerald

    // Math 18 Modules (Subtle Red)
    { id: 'm18_mod1', name: 'Linear Equations', type: 'module', color: '#fca5a5', val: 12 },
    { id: 'm18_mod2', name: 'Matrix Algebra', type: 'module', color: '#fca5a5', val: 12 },
    
    // CSE 101 Modules (Subtle Blue)
    { id: 'cse101_mod1', name: 'Graph Algorithms', type: 'module', color: '#93c5fd', val: 12 },
    { id: 'cse101_mod2', name: 'Dynamic Programming', type: 'module', color: '#93c5fd', val: 12 },

    // Math 18 Assignments (White/Gray)
    { id: 'm18_hw1', name: 'Homework 1', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_quiz1', name: 'Quiz 1', type: 'assignment', color: '#e2e8f0', val: 8 },

    // CSE 101 Assignments (White/Gray)
    { id: 'cse101_pa1', name: 'PA1: BFS/DFS', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_midterm', name: 'Midterm', type: 'assignment', color: '#e2e8f0', val: 8 },
  ],
  links: [
    // Root -> Courses
    { source: 'root', target: 'math18' },
    { source: 'root', target: 'cse101' },
    { source: 'root', target: 'cogs10' },

    // Course -> Module
    { source: 'math18', target: 'm18_mod1' },
    { source: 'math18', target: 'm18_mod2' },
    { source: 'cse101', target: 'cse101_mod1' },
    { source: 'cse101', target: 'cse101_mod2' },

    // Module -> Assignment
    { source: 'm18_mod1', target: 'm18_hw1' },
    { source: 'm18_mod1', target: 'm18_quiz1' },
    { source: 'cse101_mod1', target: 'cse101_pa1' },
    { source: 'cse101_mod2', target: 'cse101_midterm' },
  ]
};
