import Matter from "matter-js";
import { Animated, Dimensions } from "react-native";

//components
import Ball from "./components/Ball";

//common utils 
import { BALL_RADIUS } from "./utils/CommonUtils";

const { width: screenWidth } = Dimensions.get("window");
let ballCount = 0;

const Physics = (entities, { time,  events }, targetBucket = 2) => {
  const engine = entities.physics.engine;

  Matter.Engine.update(engine, time.delta);

  const defaultGravity = 0;
  const eventsArray = events || [];

  if (eventsArray) {
    eventsArray.forEach((event) => {
      if (event.type === "add-ball") {
        const newBallId = `ball_${ballCount}`;
        const newBall = {
          body: Matter.Bodies.circle(screenWidth / 2, 50, BALL_RADIUS, {
            density: 0.1,
            restitution: 0.5,
            velocity: { x: 0, y: 5 },
            friction: 0.5,
            frictionAir: 0.05,
            label: "ball",
          }),
          size: [BALL_RADIUS*2, BALL_RADIUS*2],
          renderer: Ball,
        };

        Matter.World.add(engine.world, newBall.body);

        entities[newBallId] = newBall;
        ballCount++;
      }
    });
  }

  let targetBucketPosition;
  const targetBucketKey = Object.keys(entities).find(
    (key) => key === `bucket_${targetBucket - 1}`
  );
  if (targetBucketKey) {
    targetBucketPosition = entities[targetBucketKey].body.position;
  }

  Matter.Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;
    const forceMagnitude = 4;

    pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;

      const ball = bodyA.label === "ball" ? bodyA : bodyB;
      const plinko = bodyA.label === "plinko" ? bodyA : bodyB;

      const plinkoEntityKey = Object.keys(entities).find(
        (key) => entities[key].body === plinko
      );

      if (plinkoEntityKey) {
        entities[plinkoEntityKey].isHighlighted = true;
      }

      if (plinko.isFirstColumn) {
        Matter.Body.setVelocity(ball, { x: 0.5, y: -2 });
        Matter.Body.applyForce(bodyA, bodyB.position, {
          x: forceMagnitude,
          y: 0,
        });
      } else {
        const ballPositionX = bodyB.position.x;
        const ballPositionY = bodyB.position.y;
  
        let xDifferenceBetweenBallAndBucket =
          targetBucketPosition.x - ballPositionX;
        xDifferenceBetweenBallAndBucket = Math.floor(
          xDifferenceBetweenBallAndBucket / 10
        );
        let yDifferenceBetweenBallAndBucket =
          targetBucketPosition.y - ballPositionY;
        yDifferenceBetweenBallAndBucket = Math.floor(
          yDifferenceBetweenBallAndBucket / 30
        );
  
        let xDirectionVelocity;
  
        if (
          yDifferenceBetweenBallAndBucket > 5 &&
          xDifferenceBetweenBallAndBucket < 2
        ) {
          xDirectionVelocity = 1.6;
        } else if (
          yDifferenceBetweenBallAndBucket > 5 &&
          xDifferenceBetweenBallAndBucket < 3
        ) {
          xDirectionVelocity = 3;
        } else {
          xDirectionVelocity = 3;
        }
  
        if (
          (bodyA.label === "ball" && bodyB.label === "plinko") ||
          (bodyA.label === "plinko" && bodyB.label === "ball")
        ) {
          Matter.Body.setVelocity(bodyA, { x: bodyB.velocity.x, y: -4 });
          if (bodyA.row >= 6) {
            if (xDifferenceBetweenBallAndBucket < 0) {
              Matter.Body.setVelocity(bodyA, { x: -xDirectionVelocity, y: -4 });
              Matter.Body.applyForce(bodyA, bodyB.position, {
                x: -forceMagnitude,
                y: 0,
              });
              engine.world.gravity.x = 1;
              engine.world.gravity.isPoint = true;
            } else if (xDifferenceBetweenBallAndBucket === 0) {
              const randomNumber = Math.floor(Math.random() * 2);
              if(randomNumber === 0) {
                Matter.Body.applyForce(bodyA, bodyB.position, {
                  x: -forceMagnitude,
                  y: 0,
                });
                engine.world.gravity.x = 1;
                engine.world.gravity.isPoint = true;
              }else {
                Matter.Body.applyForce(bodyA, bodyB.position, {
                  x: forceMagnitude,
                  y: 0,
                });
                engine.world.gravity.x = 1;
                engine.world.gravity.isPoint = true;
              }
              
            } 
            else {
              Matter.Body.setVelocity(bodyA, { x: xDirectionVelocity, y: -4 });
              Matter.Body.applyForce(bodyA, bodyB.position, {
                x: forceMagnitude,
                y: 0,
              });
            }
          }
        }
      }

      if (
        (bodyA.label === "ball" && bodyB.label === "bucket") ||
        (bodyA.label === "bucket" && bodyB.label === "ball")
      ) {
        const ballBody = bodyA.label === "ball" ? bodyA : bodyB;
        const ballKey = Object.keys(entities).find(
          (key) => entities[key].body === ballBody
        );

        const bucketBody = bodyA.label === "bucket" ? bodyA : bodyB;
        const bucketKey = Object.keys(entities).find(
          (key) => entities[key].body === bucketBody
        );

        const animatedValue = entities[bucketKey].animatedValue;

        if (ballKey) {
          Matter.World.remove(engine.world, ballBody);
          delete entities[ballKey];  

          const bucketEntity = entities[bucketKey];
          const points = bucketEntity.points;

          if (bucketEntity.updateScore) {
            bucketEntity.updateScore(points);
          }

          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true, 
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start(({ finished }) => {
            if (finished) {
              animatedValue.setValue(0);
            }
          });      
        }
        

      }
    });

    engine.world.gravity.x = defaultGravity;

  });

  return entities;
};

export default Physics;
