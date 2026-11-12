
import { init } from "z3-solver";

const { Context } = await init();
const { Solver, Int, And, Or } = new Context("main");

// ==========================================
// PART 1: CHILDREN AND PETS LOGIC PUZZLE
// ==========================================

// Pet values:
// Cat = 0, Dog = 1, Bird = 2, Fish = 3

const solver = new Solver();

const bob = Int.const("bob");
const mary = Int.const("mary");
const cathy = Int.const("cathy");
const sue = Int.const("sue");

const children = [bob, mary, cathy, sue];

// Each child must own one of the four pets
for (const child of children) {
    solver.add(
        Or(
            child.eq(0),
            child.eq(1),
            child.eq(2),
            child.eq(3)
        )
    );
}

// Every child has a different pet
solver.add(
    bob.neq(mary),
    bob.neq(cathy),
    bob.neq(sue),
    mary.neq(cathy),
    mary.neq(sue),
    cathy.neq(sue)
);

// Puzzle clues
solver.add(bob.eq(1));    // Bob has the Dog
solver.add(sue.eq(2));    // Sue has the Bird
solver.add(mary.neq(3));  // Mary does not have the Fish

console.log("PART 1: Children and Pets");

if (await solver.check() === "sat") {
    const model = solver.model();

    const petNames = ["Cat", "Dog", "Bird", "Fish"];

    console.log("SAT. Solution found:");

    console.log("Bob:", petNames[parseInt(model.eval(bob).toString())]);
    console.log("Mary:", petNames[parseInt(model.eval(mary).toString())]);
    console.log("Cathy:", petNames[parseInt(model.eval(cathy).toString())]);
    console.log("Sue:", petNames[parseInt(model.eval(sue).toString())]);
} else {
    console.log("UNSAT. No solution found.");
}

// ==========================================
// PART 2: GENERATE INSIDE THE FENCE
// ==========================================

solver.reset();

const x = Int.const("x_inside");
const y = Int.const("y_inside");

// Strictly inside the fence
solver.add(
    x.gt(5),
    x.lt(10),
    y.gt(15),
    y.lt(25)
);

console.log("\nPART 2: Inside the Fence");

if (await solver.check() === "sat") {
    const model = solver.model();

    console.log("SAT. Cow location:");
    console.log("x =", model.eval(x).toString());
    console.log("y =", model.eval(y).toString());
} else {
    console.log("UNSAT.");
}

// ==========================================
// PART 3: GENERATE ON THE FENCE
// ==========================================

solver.reset();

const x_fence = Int.const("x_fence");
const y_fence = Int.const("y_fence");

// Decoration on the top side OR left side
solver.add(
    Or(
        And(
            y_fence.eq(15),
            x_fence.ge(5),
            x_fence.le(10)
        ),
        And(
            x_fence.eq(5),
            y_fence.ge(15),
            y_fence.le(25)
        )
    )
);

console.log("\nPART 3: On the Fence");

if (await solver.check() === "sat") {
    const model = solver.model();

    console.log("SAT. Decoration location:");
    console.log("x =", model.eval(x_fence).toString());
    console.log("y =", model.eval(y_fence).toString());
} else {
    console.log("UNSAT.");
}

// ==========================================
// PART 4: GENERATE OUTSIDE THE FENCE
// ==========================================

solver.reset();

const x_outside = Int.const("x_outside");
const y_outside = Int.const("y_outside");

// Tree must be outside, not on the fence or inside.
// Also x >= 8 and y >= 20.
solver.add(
    x_outside.ge(8),
    y_outside.ge(20),

    Or(
        x_outside.lt(5),
        x_outside.gt(10),
        y_outside.lt(15),
        y_outside.gt(25)
    )
);

console.log("\nPART 4: Outside the Fence");

if (await solver.check() === "sat") {
    const model = solver.model();

    console.log("SAT. Tree location:");
    console.log("x =", model.eval(x_outside).toString());
    console.log("y =", model.eval(y_outside).toString());
} else {
    console.log("UNSAT.");
}
