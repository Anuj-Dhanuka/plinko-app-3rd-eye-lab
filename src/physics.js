import Matter from "matter-js";
import Ball from "./components/Ball";
import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
let ballCount = 0;
const collidePairs = new Set();

const Physics = (entities, { time, dispatch, events }, targetBucket = 1) => {
  const engine = entities.physics.engine;

  Matter.Engine.update(engine, time.delta);

  const eventsArray = events || [];

  if (eventsArray) {
    eventsArray.forEach((event) => {
      if (event.type === "add-ball") {
        const newBallId = `ball_${ballCount}`;
        const newBall = {
          body: Matter.Bodies.circle(screenWidth / 2, 50, 3, {
            density: 0.1,
            restitution: 0.5,
            velocity: { x: 0, y: 5 },
            friction: 0.5,
            frictionAir: 0.05,
            label: "ball",
          }),
          size: [6, 6],
          renderer: Ball,
        };

        Matter.World.add(engine.world, newBall.body);

        entities[newBallId] = newBall;
        ballCount++;
      }
    });
  }

  let targetBucketPosition
  const targetBucketKey = Object.keys(entities).find(
    (key) => key === `bucket_${targetBucket - 1}`
  );
  if (targetBucketKey) {
    targetBucketPosition = entities[targetBucketKey].body.position;
  }

  Matter.Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;
    pairs.forEach((pair) => {

      const { bodyA, bodyB } = pair;
  
      const ballPositionX =  bodyB.position.x 
      const ballPositionY = bodyB.position.y

      let  xDifferenceBetweenBallAndBucket = targetBucketPosition.x - ballPositionX
      xDifferenceBetweenBallAndBucket = Math.floor(xDifferenceBetweenBallAndBucket/10)
      let yDifferenceBetweenBallAndBucket = targetBucketPosition.y - ballPositionY
      yDifferenceBetweenBallAndBucket = Math.floor(yDifferenceBetweenBallAndBucket/30)

      //console.log(xDifference, yDifference)
      let xDirectionVelocity 
  
      if(yDifferenceBetweenBallAndBucket < 10 && xDifferenceBetweenBallAndBucket < 2) {
        xDirectionVelocity = 2
      } else if (yDifferenceBetweenBallAndBucket < 10 && xDifferenceBetweenBallAndBucket < 3) {
        xDirectionVelocity = 2.5
      } else {
        xDirectionVelocity = 3
      }

      const forceMagnitude = 1;
      //console.log(bodyA.label, bodyB.label)
      if (
        (bodyA.label === "ball" && bodyB.label === "plinko") ||
        (bodyA.label === "plinko" && bodyB.label === "ball")
      ) {
        const collisionId = `${bodyA.id}_${bodyB.id}`;
        Matter.Body.setVelocity(bodyA, { x: bodyB.velocity.x, y: -5 });
        if (bodyA.row >= 6) {
          //if (!collidePairs.has(collisionId)) {
            if (xDifferenceBetweenBallAndBucket < 0) {
              Matter.Body.setVelocity(bodyA, { x: -xDirectionVelocity, y: -5 });
              Matter.Body.applyForce(bodyA, bodyB.position, {
                x: -forceMagnitude,
                y: 0,
              });
            } else {
              Matter.Body.setVelocity(bodyA, { x: xDirectionVelocity, y: -5 });
              Matter.Body.applyForce(bodyA, bodyB.position, {
                x: forceMagnitude,
                y: 0,
              });
            }
            //Matter.Body.setAngularVelocity(bodyA, 0);
            collidePairs.add(bodyB);
            //console.log("collide")
          }
        //}
      }

      if (
        (bodyA.label === "ball" && bodyB.label === "bucket") ||
        (bodyA.label === "bucket" && bodyB.label === "ball")
      ) {
        const ballBody = bodyA.label === "ball" ? bodyA : bodyB;
        const ballKey = Object.keys(entities).find(
          (key) => entities[key].body === ballBody
        );

        if (ballKey) {
          Matter.World.remove(engine.world, ballBody);
          delete entities[ballKey];
        }
      }
    });
  });

  return entities;
};

export default Physics;
