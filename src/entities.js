import Matter from "matter-js";
import { Animated, Dimensions } from "react-native";

//components
import Plinko from "./components/Plinko";
import Bucket from "./components/Bucket";

//utils
import { NUMBER_OF_ROWS, PLINKO_RADIUS, SPACING_Y, SPACING_X, PLINKO_TOP_DISTANCE, BUCKET_HEIGHT } from "./utils/CommonUtils";

const { width: screenWidth} = Dimensions.get("window");

const entities = (handleScore) => {
  
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;

  engine.world.gravity.y = 0.2;
  engine.world.gravity.x = 0;

  const numberOfRows = NUMBER_OF_ROWS;
  const plinkoRadius = PLINKO_RADIUS;
  const plinkoSpacingY = SPACING_Y;
  const plinkoSpacingX = SPACING_X;
  const plinkoTopDistance = PLINKO_TOP_DISTANCE;
  const bucketWidth = plinkoSpacingX - plinkoRadius * 2;
  const bucketHeight = BUCKET_HEIGHT;

  let lastRowFirstPlinkoPosition = [];
  let plinkos = [];
  let buckets = [];

  const bucketDetails = [
    { points: 110, color: "#FF0000" },
    { points: 41, color: "#FF0000" },
    { points: 10, color: "#ff6666" },
    { points: 5, color: "#FFA07A" },
    { points: 3, color: "#FF9900" },
    { points: 1.5, color: "#FFC107" },
    { points: 1, color: "#FFC400" },
    { points: 0.5, color: "#ffcc00" },
    { points: 0.3, color: "#ffd11a" },
    { points: 0.5, color: "#ffcc00" },
    { points: 1, color: "#FFC400" },
    { points: 1.5, color: "#FFC107" },
    { points: 3, color: "#FF9900" },
    { points: 5, color: "#FFA07A" },
    { points: 10, color: "#ff6666" },
    { points: 41, color: "#FF0000" },
    { points: 110, color: "#FF0000" },
  ];

  for (let i = 0; i < numberOfRows; i++) {
    const plinkoCount = i + 3;
    const rowXStart =
      screenWidth / 2 - ((plinkoCount - 1) * plinkoSpacingX) / 2;
    for (let j = 0; j < i + 3; j++) {
      const plinkoY = plinkoTopDistance + plinkoSpacingY * i;
      const plinkoX = rowXStart + plinkoSpacingX * j;
      const plinko = Matter.Bodies.circle(plinkoX, plinkoY, plinkoRadius, {
        isStatic: true,
        restitution: 1,
        friction: 0.5,
        isHighlighted: false,
        label: "plinko",
        row: i,
        isFirstColumn: j === 0
      });
      Matter.World.add(world, plinko);
      plinkos.push({
        body: plinko,
        size: [plinkoRadius * 2, plinkoRadius * 2],
        renderer: Plinko,
      });
      if (i === numberOfRows - 1 && j === 0) {
        lastRowFirstPlinkoPosition = [plinkoX, plinkoY];
      }
    }
  }

  for (let i = 0; i <= numberOfRows; i++) {
    const bucketPositionY = lastRowFirstPlinkoPosition[1] + 25;
    const bucketPositionX =
      lastRowFirstPlinkoPosition[0] +
      bucketWidth / 2 +
      plinkoRadius +
      i * plinkoRadius * 2 +
      i * bucketWidth;
    const bucket = Matter.Bodies.rectangle(
      bucketPositionX,
      bucketPositionY,
      bucketWidth,
      bucketHeight,
      { isStatic: true, label: "bucket" }
    );
    const animatedValue = new Animated.Value(0);
    Matter.World.add(world, bucket);
    buckets.push({
      body: bucket,
      size: [bucketWidth, bucketHeight],
      renderer: Bucket,
      color: bucketDetails[i].color,
      points: bucketDetails[i].points,
      animatedValue: animatedValue,
      updateScore: handleScore
    });
  }

  return {
    physics: { engine, world },
    ...Object.fromEntries(plinkos.map((plinko, i) => [`plinko_${i}`, plinko])),
    ...Object.fromEntries(buckets.map((bucket, i) => [`bucket_${i}`, bucket])),
  };
};

export default entities;
