import Matter from "matter-js";
import { Animated, Dimensions } from "react-native";

//components
import Ball from "./components/Ball";

//common utils
import {
  BALL_RADIUS,
  DEFAULT_ENGINE_GRAVITY_X,
  DEFAULT_ENGINE_GRAVITY_Y,
} from "./utils/CommonUtils";

const { width: screenWidth } = Dimensions.get("window");
let ballCount = 0;

const Physics =
  (randomNumber, randomRow) =>
  (entities, { time, events }) => {
    const engine = entities.physics.engine;
    const targetBucket = randomNumber;
    Matter.Engine.update(engine, time.delta);
    const eventsArray = events || [];

    if (eventsArray) {
      eventsArray.forEach((event) => {
        if (event.type === "add-ball") {
          engine.world.gravity.x = DEFAULT_ENGINE_GRAVITY_X;
          engine.world.gravity.y = DEFAULT_ENGINE_GRAVITY_Y;
          const newBallId = `ball_${ballCount}`;
          const newBall = {
            body: Matter.Bodies.circle(screenWidth / 2, 50, BALL_RADIUS, {
              density: 0.1,
              restitution: 0.5,
              velocity: { x: 0, y: 5 },
              friction: 0.7,
              frictionAir: 0.08,
              label: "ball",
            }),
            size: [BALL_RADIUS * 2, BALL_RADIUS * 2],
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
      engine.world.gravity.x = DEFAULT_ENGINE_GRAVITY_X;
      engine.world.gravity.y = DEFAULT_ENGINE_GRAVITY_Y;
      const pairs = event.pairs;
      const forceMagnitude = 10;

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
        } else if (plinko.isLastColumn) {
          Matter.Body.setVelocity(ball, { x: -0.5, y: -2 });
          Matter.Body.applyForce(bodyA, bodyB.position, {
            x: -forceMagnitude,
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
            xDirectionVelocity = 2.5;
          } else if (
            yDifferenceBetweenBallAndBucket > 5 &&
            xDifferenceBetweenBallAndBucket < 3
          ) {
            xDirectionVelocity = 2.8;
          } else {
            xDirectionVelocity = 3.2;
          }

          if (
            (bodyA.label === "ball" && bodyB.label === "plinko") ||
            (bodyA.label === "plinko" && bodyB.label === "ball")
          ) {
            Matter.Body.setVelocity(bodyA, { x: bodyB.velocity.x, y: -3 });
            if (bodyA.row === randomRow) {
              const randomNumberForMagnitude = Math.floor(Math.random() * 2);
              const randomMagnitude = randomNumberForMagnitude === 0 ? -1 : 1;
              Matter.Body.applyForce(bodyA, bodyB.position, {
                x: forceMagnitude * randomMagnitude,
                y: 0,
              });
              engine.world.gravity.x = 1 * randomMagnitude;
              engine.world.gravity.isPoint = true;
            }
            else if (
              ((targetBucket > 2 || targetBucket < 16) && bodyA.row >= 2) ||
              ((targetBucket < 3 || targetBucket > 15) && bodyA.row >= 0)
            ) {
              if (xDifferenceBetweenBallAndBucket < 0) {
                Matter.Body.setVelocity(bodyA, {
                  x: -xDirectionVelocity,
                  y: -3,
                });
                Matter.Body.applyForce(bodyA, bodyB.position, {
                  x: -forceMagnitude,
                  y: 0,
                });
                engine.world.gravity.x = -1.9;
                engine.world.gravity.isPoint = true;
              } else if (xDifferenceBetweenBallAndBucket === 0) {
                const randomNumber = Math.floor(Math.random() * 2);
                if (randomNumber === 0) {
                  const randomNumberForMagnitude = Math.floor(
                    Math.random() * 2
                  );
                  const randomMagnitude =
                    randomNumberForMagnitude === 0 ? -1 : 1;
                  Matter.Body.applyForce(bodyA, bodyB.position, {
                    x: forceMagnitude * randomMagnitude,
                    y: 0,
                  });
                  engine.world.gravity.x = 1 * randomMagnitude;
                  engine.world.gravity.isPoint = true;
                } else {
                  Matter.Body.applyForce(bodyA, bodyB.position, {
                    x: forceMagnitude,
                    y: 0,
                  });
                  engine.world.gravity.x = 1.9;
                  engine.world.gravity.isPoint = true;
                }
              } else {
                Matter.Body.setVelocity(bodyA, {
                  x: xDirectionVelocity,
                  y: -3,
                });
                Matter.Body.applyForce(bodyA, bodyB.position, {
                  x: forceMagnitude,
                  y: 0,
                });
              }
            } else {
              const randomNumberForMagnitude = Math.floor(Math.random() * 2);
              const randomMagnitude = randomNumberForMagnitude === 0 ? -1 : 1;
              Matter.Body.applyForce(bodyA, bodyB.position, {
                x: forceMagnitude * randomMagnitude,
                y: 0,
              });
              engine.world.gravity.x = 1 * randomMagnitude;
              engine.world.gravity.isPoint = true;
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

      engine.world.gravity.x = DEFAULT_ENGINE_GRAVITY_X;
      engine.world.gravity.y = DEFAULT_ENGINE_GRAVITY_Y;
    });

    return entities;
  };

export default Physics;
