import Matter from "matter-js";
import { Dimensions } from "react-native";

import Plinko from "./components/Plinko";
import Bucket from "./components/Bucket";

const {width: screenWidth, height: screenHeight} = Dimensions.get("window")

const entities = () => {
    let engine = Matter.Engine.create({enableSleeping: false})
    let world = engine.world

    engine.world.gravity.y = 0.2

    const numberOfRows = 16
    const plinkoRadius = 3
    let plinkos = []
    let buckets = []
    const plinkoSpacingY = 30
    const plinkoSpacingX = 18
    const plinkoTopDistance = 100
    const bucketWidth = plinkoSpacingX - (plinkoRadius * 2)
    const bucketHeight = 13
    let lastRowFirstPlinkoPosition = []

    for (let i = 0; i < numberOfRows; i++) {
        const plinkoCount = i + 3;
        const rowXStart = screenWidth / 2 - (plinkoCount - 1) * plinkoSpacingX / 2;
        for (let j = 0; j < i+3; j++) {
            const plinkoY = plinkoTopDistance + plinkoSpacingY * i
            const plinkoX =  rowXStart + plinkoSpacingX * j 
            const plinko = Matter.Bodies.circle(plinkoX, plinkoY, plinkoRadius, {isStatic: true, restitution: 1, friction: 0.5})
            plinko.label = "plinko"
            plinko.row = i;
            Matter.World.add(world, plinko)
            plinkos.push({body: plinko, size: [plinkoRadius*2, plinkoRadius*2], renderer: Plinko})
            if((i === (numberOfRows-1)) && (j === 0)) {
                lastRowFirstPlinkoPosition = [plinkoX, plinkoY]
            }

        }   
    }

    for(let i = 0 ; i <= numberOfRows ; i++ ) {
        const bucketPositionY = lastRowFirstPlinkoPosition[1] + 25
        const bucketPositionX = ((lastRowFirstPlinkoPosition[0] + bucketWidth /2 + plinkoRadius))  + (i *plinkoRadius *2) + (i*bucketWidth)
        const bucket = Matter.Bodies.rectangle(bucketPositionX, bucketPositionY , bucketWidth, bucketHeight, {isStatic: true, label: "bucket"})
        Matter.World.add(world, bucket)
        buckets.push({body: bucket, size: [bucketWidth, bucketHeight], renderer: Bucket})

    }


    return {
        physics: {engine, world},
        ...Object.fromEntries(plinkos.map((plinko, i) => [`plinko_${i}`, plinko] )),
        ...Object.fromEntries(buckets.map((bucket, i) => [`bucket_${i}`, bucket]))
    }
}

export default entities