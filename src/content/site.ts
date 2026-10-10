/*
  All site content lives here. To add a project, append to `projects`.
  Facts come from the résumé and, for Lunabotics, the team portfolio doc. Anything in
  `todo(...)` is a visible placeholder on the site until you replace it with a real value.
*/

/** Marks content that still needs a real value. Rendered as a dashed placeholder. */
export const todo = (note: string) => ({ todo: note }) as const;
export type Todo = ReturnType<typeof todo>;
export type Text = string | Todo;
export const isTodo = (t: unknown): t is Todo =>
  typeof t === "object" && t !== null && "todo" in t;

export const lunaboticsDoc =
  "https://docs.google.com/document/d/1_KJtYwuVd_apYhRT1pqd5Q2ycKsXsacLDUxbVgw8AAY/edit?usp=sharing";

export const site = {
  name: "Vern Prayoonthong",
  legalName: "Nattapat (Vern) Prayoonthong",
  initials: "NPV",
  email: "npvern@gmail.com",
  linkedin: "https://www.linkedin.com/in/npvern/",
  github: null as string | null,
  resume: "/resume.pdf",
  location: "Pittsburgh, PA",
  status: "Open to mechanical and robotics internships",
  school: "Carnegie Mellon University",
  degree: "B.S. Mechanical Engineering, Minor in Robotics",
  graduation: "Expected May 2028",
};

/**
 * One item in a project's gallery. The first item is the main image; the rest are thumbnails.
 * `fit: "contain"` shows the whole image (CAD, portrait photos); "cover" fills the frame.
 */
export type GalleryItem =
  | {
      kind: "image";
      src: string;
      alt: string;
      caption: string;
      width: number;
      height: number;
      fit?: "cover" | "contain";
      /** Which part of the image the small thumbnail shows, as a CSS object-position (e.g. "50% 85%"). */
      thumbFocus?: string;
    }
  /** A YouTube video. Shows a poster frame until clicked, then plays inline. */
  | { kind: "video"; youtubeId: string; title: string; caption: string }
  | { kind: "sprocket"; caption: string }
  | { kind: "placeholder"; caption: string };

/** An empty gallery slot with a note on what image belongs there. */
export const needed = (caption: string): GalleryItem => ({ kind: "placeholder", caption });

export type Project = {
  slug: string;
  name: string;
  year: string;
  dates: string;
  status: "In progress" | "Completed";
  /** Omit to hide the Role row. */
  role?: Text;
  tagline: string;
  summary: string;
  metric: { value: string; label: string };
  stack: string[];
  /** First item is the main image, the rest are thumbnails. Files live under /public/projects.
   *  Leave empty for a text-only project (no image block anywhere). */
  gallery: GalleryItem[];
  /** "drawing" frames the preview as a drawing sheet, "window" as an app window. */
  frame: "drawing" | "window";
  story: {
    problem: Text[];
    approach: Text[];
    results: Text[];
  };
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "lunabotics-drivetrain",
    name: "Lunabotics tracked drive",
    year: "2025",
    dates: "Aug 2025 - Present",
    status: "In progress",
    role: "Mobility Subteam Lead",
    tagline: "A tracked drive system for an 80 kg lunar rover",
    summary:
      "I lead the 6-person mobility subteam on CMU Lunabotics. We are building the tracked drive for an 80 kg rover. I designed the drive sprocket and its mechanical interfaces, then machined and assembled the track hardware.",
    metric: { value: "±0.01 in", label: "tolerance held on 60+ CNC-drilled tread plates" },
    stack: ["SolidWorks", "Onshape", "CNC drilling", "Manual milling", "3D printing", "DFM"],
    gallery: [
      {
        kind: "image",
        src: "/projects/lunabotics/modular-track-cad.jpg",
        alt: "SolidWorks render of the modular track assembly with treads, side plates, and motor",
        caption: "Modular track CAD, about 90% of final component specs. Modeling and integration led by a teammate, with design input from the whole subteam.",
        width: 1610,
        height: 873,
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/lunabotics/modular-track-chassis.jpg",
        alt: "Modular track chassis on a workbench, side plates and skid bars visible, drive motor mounted at one end",
        caption: "Modular track chassis before the treads go on. Slots in the side plates let the drive sprocket come out as one module (slot concept by teammates).",
        width: 1201,
        height: 1600,
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/lunabotics/first-rover.jpg",
        alt: "First fully integrated Lunabotics rover on the lab floor, tracks on both sides and the excavator on top",
        caption: "First full-rover integration, built with the Excavation, Structures, and Avionics teams for software testing and telemetry.",
        width: 940,
        height: 520,
      },
      {
        kind: "image",
        src: "/projects/lunabotics/trackbot-v1.jpg",
        alt: "Trackbot v1 prototype on a workbench with two aluminum tracks and a temporary wooden deck",
        caption: "Trackbot v1, built so the avionics team could measure motor current draw. The wood parts were temporary stand-ins for aluminum.",
        width: 480,
        height: 640,
        fit: "contain",
      },
    ],
    frame: "drawing",
    story: {
      problem: [
        "CMU Lunabotics needs a drive system that can move an 80 kg rover. The mobility subteam chose a tracked design.",
        "Mobility is a primary driver of rover performance. Derailment, excessive friction, or a weak structure in the tracks would keep the rover from succeeding at competition.",
      ],
      approach: [
        "Led a 6-member mobility subteam through design and fabrication of the tracked drive.",
        "Coordinated the move of 20+ CAD components from Onshape to SolidWorks across the team.",
        "Designed and integrated a 6-tooth, 5.4 in diameter drive sprocket and 9 mechanical interfaces over 4 redesigns. Each revision added more DFM considerations to improve manufacturability, assembly, and fit.",
        "Manufactured 60+ aluminum tread plates by precision cutting and CNC drilling.",
        "Fabricated and integrated 10+ track components with 3D printing and manual milling for the final assembly.",
      ],
      results: [
        "Held ±0.01 in tolerance across 60+ machined tread plates.",
        "Integrated 10+ fabricated track components into the final rover assembly.",
        "Testing found regolith getting into the sealed bearings and stopping them from turning freely. A felt seal was designed and test-fitted; it still needs longer testing.",
      ],
    },
    links: [{ label: "Lunabotics team portfolio (Google Doc)", href: lunaboticsDoc }],
  },
  {
    slug: "hammock-chair",
    name: "Foldable hammock chair",
    year: "2026",
    dates: "Mar 2026 - May 2026",
    status: "Completed",
    role: "Team of 4",
    tagline: "A fold-flat hanging chair for day hikers at Shenandoah National Park",
    summary:
      "With three teammates I designed a hanging chair for casual day hikers. Its rigid frame folds flat into one bundle, locks open with quick-release pins, and hangs from a branch on climbing rope. We checked it with hand calculations and FEA, then built and tested a prototype.",
    metric: { value: "2.52", label: "FEA factor of safety on the seat frame (hand calcs: 1.66)" },
    stack: ["SolidWorks", "Ansys Discovery FEA", "Hand calculations", "Fabrication", "Prototype testing"],
    gallery: [
      {
        kind: "image",
        src: "/projects/hammock-chair/built-chair.jpg",
        alt: "The finished hammock chair, a wooden frame with rope netting, hanging from a tree branch by climbing rope in a park",
        caption: "The built prototype: a softwood frame with hemp rope netting, hung from a branch by climbing rope.",
        width: 1201,
        height: 1600,
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/hammock-chair/cad-deployed.jpg",
        alt: "SolidWorks model of the chair unfolded and hanging from a spreader bar on rope",
        caption: "Mid-fidelity SolidWorks model, unfolded and hanging.",
        thumbFocus: "50% 82%",
        width: 329,
        height: 494,
        fit: "contain",
      },
    ],
    frame: "drawing",
    story: {
      problem: [
        "Casual day hikers at Shenandoah National Park want a comfortable place to rest but cannot carry heavy gear. Interviews with three Virginia hikers pointed to three priorities: portability, quick setup, and safety.",
        "Targets: fold to fit in or strap onto a day pack at 15 lb or less, set up without tools, and carry a 250 lb static load with a factor of safety of at least 2.0, on a $180 budget.",
      ],
      approach: [
        "Sketched 20 concepts, narrowed them to four tree-hung designs, and checked each with static equilibrium and stress hand calculations. The 12 mm suspension rope came out at a factor of safety of about 4.2 under an 800 N load.",
        "Chose a foldable rigid-frame hanging chair and modeled it in SolidWorks: a seat and backrest joined by a hinge that collapses flat, with hemp rope netting to spread the occupant's weight.",
        "After peer review, replaced the steel chain suspension with climbing rope to cut carry weight.",
        "Quick-release pins lock the joints for tool-free setup. Folded, the netting wraps the frame and hardware into one bundle.",
        "Ran FEA in Ansys Discovery on the seat, six fir frame members plus the netting, applying the occupant's weight as pressure on the seat and backrest.",
      ],
      results: [
        "FEA gave a factor of safety of 2.52 on the seat frame; hand calculations gave 1.66. The FEA left out the suspension rope and treats wood as equally strong in every direction, so we expect the real margin to be lower than 2.52.",
        "Material cost came to $134.25, under the $180 budget.",
        "Built and tested the prototype to verify stability, fit, and load-bearing performance.",
      ],
    },
    links: [],
  },
  {
    slug: "general-robotics",
    name: "Urban search and rescue robot",
    year: "2025",
    dates: "Aug 2025 - Jul 2026",
    status: "Completed",
    tagline: "Mechanical design for a search and rescue robot, plus a self-balancing robot",
    summary:
      "I designed and fabricated mechanical components in SolidWorks for an Urban Search and Rescue robot, including a custom mold for casting polyurethane wheels. Separately, I tuned PID control for a self-balancing robot through repeated testing.",
    metric: { value: "Custom mold", label: "designed for casting polyurethane wheels" },
    stack: ["SolidWorks", "Mold design", "PID control", "Prototyping"],
    gallery: [
      {
        kind: "image",
        src: "/projects/usar-robot/printed-mold-assembled.jpg",
        alt: "The white 3D-printed wheel mold, two halves bolted together at the tabs, with the toothed insert seated in the center",
        caption: "The 3D-printed mold, assembled: two halves bolted together with the insert in place.",
        width: 1345,
        height: 1600,
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/usar-robot/printed-mold-parts.jpg",
        alt: "The printed mold body with its slotted wall and bolted tabs, next to the separate toothed insert",
        caption: "The printed mold body and the insert, taken apart.",
        width: 1175,
        height: 1600,
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/usar-robot/wheel-mold-assembled.png",
        alt: "SolidWorks model of the round wheel mold with mounting tabs, with the wheel insert seated inside",
        caption: "SolidWorks model of the wheel casting mold, assembled.",
        width: 917,
        height: 648,
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/usar-robot/wheel-model.png",
        alt: "SolidWorks model of a wheel with raised tread blocks around its rim and a keyed center hub",
        caption: "SolidWorks model of the wheel, with tread blocks and a keyed hub.",
        width: 580,
        height: 637,
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/usar-robot/wheel-mold-body.png",
        alt: "SolidWorks model of the empty mold body with slotted walls and two bolt tabs",
        caption: "The mold body on its own, showing the tread slots in the wall.",
        width: 622,
        height: 458,
        fit: "contain",
      },
    ],
    frame: "drawing",
    story: {
      problem: [
        "An Urban Search and Rescue robot needs custom mechanical parts, including wheels, built for the job.",
      ],
      approach: [
        "Designed and fabricated mechanical components for the robot in SolidWorks.",
        "Designed a custom mold for casting polyurethane wheels, accounting for geometry, fit, and manufacturability.",
        "Built and tested components through iterative prototyping and performance evaluation.",
        "Developed and tuned PID control algorithms for a self-balancing robot through repeated testing and data analysis.",
      ],
      results: [],
    },
    links: [],
  },
  {
    slug: "posture-your-focus",
    name: "Posture Your Focus",
    year: "2025",
    dates: "Apr 2025 - May 2025",
    status: "Completed",
    role: "Team of 4: posture, distance, and gaze detection",
    tagline: "A webcam app that catches slouching, leaning in, and lost focus at a desk",
    summary:
      "A CMU 15-112 term project with three teammates: a webcam app that watches posture, screen distance, focus, and phone use during desk work and alerts the user in real time. I wrote the posture and screen-distance detection and the gaze tracker, and connected the OpenCV pipeline to the app's interface.",
    metric: { value: "7.5°", label: "gaze angle that, held for 1 second, triggers a focus alert" },
    stack: ["Python", "OpenCV", "MediaPipe", "NumPy", "cmu_graphics"],
    gallery: [],
    frame: "window",
    story: {
      problem: [
        "Students and office workers slouch, sit too close to the screen, and lose focus at their desks, usually without noticing until it starts to hurt.",
      ],
      approach: [
        "Posture and distance: MediaPipe face detection draws a box around the user's face. When the box covers 20% or more of the frame, the user is leaning in or sitting too close, and the app warns them.",
        "Gaze: MediaPipe Face Mesh with iris landmarks and OpenCV's solvePnP estimate head pose. The pupils' offset along each eye's axis gives a gaze vector, and its angle from the head's forward direction measures attention. Looking more than 7.5° away for a second or longer counts as lost focus.",
        "Linked the merged OpenCV detection code to the cmu_graphics app so detection, live status, and alerts run in one interface.",
        "Teammates built phone detection with a YOLOv8 nano model, inactivity alerts, the settings and status screens, and the notification sound.",
      ],
      results: [
        "The finished app shows live status for posture, distance, and focus, and alerts the user when they slouch, lean in, look away, or pick up a phone.",
      ],
    },
    links: [],
  },
];

export type Job = {
  org: string;
  role: string;
  place: string;
  dates: string;
  current: boolean;
  points: string[];
  link?: { label: string; href: string };
};

export const work: Job[] = [
  {
    org: "CMU Lunabotics",
    role: "Mobility Subteam Lead",
    place: "Pittsburgh, PA",
    dates: "Aug 2025 - Present",
    current: true,
    points: [
      "Led a 6-member mobility subteam developing a tracked drive system for an 80 kg lunar rover.",
      "Designed and integrated a 6-tooth, 5.4 in drive sprocket and 9 mechanical interfaces through 4 redesigns.",
      "Manufactured 60+ aluminum tread plates by precision cutting and CNC drilling, holding ±0.01 in.",
    ],
    link: { label: "Read my team portfolio", href: lunaboticsDoc },
  },
  {
    org: "National Science and Technology Development Agency (NSTDA)",
    role: "Intern",
    place: "Bangkok, Thailand",
    dates: "Jun 2025 - Jul 2025",
    current: false,
    points: [
      "Developed and tested an automated object-counting system using image thresholding and contour detection.",
      "Curated and annotated a custom dataset, then trained and evaluated a YOLOv11-OBB model to detect and count objects at varied orientations.",
      "Analyzed performance across lighting and orientation conditions to find failure cases and improve robustness.",
    ],
  },
];

export const skills: { area: string; items: string[] }[] = [
  {
    area: "CAD and mechanical design",
    items: ["SolidWorks", "Onshape", "ANSYS FEA", "CFD", "3D printing", "CAD drawings"],
  },
  {
    area: "Manufacturing and prototyping",
    items: ["CNC", "Manual milling", "Mechanical assembly", "Prototyping", "Design verification", "DFM", "GD&T"],
  },
  {
    area: "Programming and data",
    items: ["Python", "C", "MATLAB", "Computer vision"],
  },
  {
    area: "Languages",
    items: ["Thai (native)", "English (fluent)", "Mandarin (intermediate, HSK 4)"],
  },
];

export const coursework = [
  "Fluid Mechanics",
  "Thermodynamics",
  "Heat Transfer",
  "Robot Kinematics and Dynamics",
  "Principles of Imperative Computation",
];
