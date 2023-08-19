console.log("Family Tree Script Loaded");
var canvas = document.getElementById("familytree");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black"; //text

//users
let individualTable = [
    { "id": 1, "name": "Alice", "birthdate": "1990-01-01" },
    { "id": 2, "name": "Bob", "birthdate": "1995-05-15" },
    { "id": 3, "name": "Carol", "birthdate": "1988-09-20" },
    { "id": 4, "name": "David", "birthdate": "2002-03-10" },
    { "id": 5, "name": "Emma", "birthdate": "1998-11-25" },
    { "id": 6, "name": "Frank", "birthdate": "1976-07-14" },
    { "id": 7, "name": "Grace", "birthdate": "1985-02-08" },
    { "id": 8, "name": "Henry", "birthdate": "1993-06-03" },
    { "id": 9, "name": "Isabel", "birthdate": "2000-09-17" },
    { "id": 10, "name": "Jack", "birthdate": "1991-04-22" },
    { "id": 11, "name": "Karen", "birthdate": "1979-12-12" },
    { "id": 12, "name": "Leo", "birthdate": "1982-08-30" },
    { "id": 13, "name": "Mia", "birthdate": "2004-07-07" },
    { "id": 14, "name": "Nathan", "birthdate": "1997-11-03" },
    { "id": 15, "name": "Olivia", "birthdate": "2001-02-18" },
    { "id": 16, "name": "Paul", "birthdate": "1989-10-29" },
    { "id": 17, "name": "Quinn", "birthdate": "1994-03-07" },
    { "id": 18, "name": "Ryan", "birthdate": "1992-06-16" },
    { "id": 19, "name": "Sophia", "birthdate": "1984-09-05" },
    { "id": 20, "name": "Tom", "birthdate": "1972-01-24" }
];


//for married users
let marriages = [
    { "marriage_id": 1, "spouse1_id": 1, "spouse2_id": 2 },
    { "marriage_id": 2, "spouse1_id": 3, "spouse2_id": 6 },
    { "marriage_id": 3, "spouse1_id": 7, "spouse2_id": 10 },
    { "marriage_id": 4, "spouse1_id": 12, "spouse2_id": 18 },
    { "marriage_id": 5, "spouse1_id": 15, "spouse2_id": 19 }
];

//showing heiarchy
  let hierarchicalRelationships = [
    { "ancestor_id": 1, "descendant_id": 2, "depth": 1 },
    { "ancestor_id": 1, "descendant_id": 3, "depth": 2 },
    { "ancestor_id": 1, "descendant_id": 6, "depth": 2 },
    { "ancestor_id": 1, "descendant_id": 7, "depth": 1 },
    { "ancestor_id": 1, "descendant_id": 10, "depth": 2 },
    { "ancestor_id": 1, "descendant_id": 12, "depth": 2 },
    { "ancestor_id": 1, "descendant_id": 15, "depth": 2 },
    { "ancestor_id": 1, "descendant_id": 19, "depth": 2 },
    { "ancestor_id": 2, "descendant_id": 3, "depth": 1 },
    { "ancestor_id": 2, "descendant_id": 6, "depth": 1 },
    { "ancestor_id": 2, "descendant_id": 7, "depth": 2 },
    { "ancestor_id": 2, "descendant_id": 10, "depth": 3 },
    { "ancestor_id": 2, "descendant_id": 12, "depth": 3 },
    { "ancestor_id": 2, "descendant_id": 15, "depth": 3 },
    { "ancestor_id": 2, "descendant_id": 19, "depth": 3 },
    // ... and so on for the other relationships
  ];

  //for children
  let childParentRelatinoshipsTable = [
    { "child_id": 3, "parent1_id": 1, "parent2_id": 2 },
    { "child_id": 5, "parent1_id": 1, "parent2_id": 2 },
    { "child_id": 7, "parent1_id": 2, "parent2_id": 1 },
    { "child_id": 9, "parent1_id": 2, "parent2_id": 3 }
  ]
  
  
  function drawFamilyTree(x, y, individualId, generation) {
    const individual = individualTable.find(individual => individual.id === individualId);
    ctx.fillText(individual.name, x, y);
  
    const children = childParentRelatinoshipsTable.filter(rel => rel.parent1_id === individualId || rel.parent2_id === individualId);
    console.log(children);
    if (children.length > 0) {
      y += 40;
  
      for (const child of children) {
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.lineTo(x, y);
        ctx.stroke();
        drawFamilyTree(x, y, child.child_id, generation + 1);
        y += 40;
      }
    }
  }
  
  function startDrawingFamilyTree(x = 30, y = 30) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const rootIndividuals = individualTable.filter(individual => !childParentRelatinoshipsTable.some(rel => rel.child_id === individual.id));
  
    for (const root of rootIndividuals) {
      drawFamilyTree(x, y, root.id, 0);
      x += 40; // Offset for multiple root individuals
    }
  }
  
  startDrawingFamilyTree();