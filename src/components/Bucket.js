import { StyleSheet, View } from "react-native"

const Bucket = (props) => {
    const width = props.size[0]
    const height = props.size[1]

    const x = props.body.position.x - width/2 
    const y = props.body.position.y - height/2
    
    return (
        <View style={styles.container}>
            <View style={styles.bucket(x, y, height, width)}></View>
        </View>
    )
}

export default Bucket

const styles = StyleSheet.create({
    container: {
        position: "absolute"
    },
    bucket: (x, y, height, width) => ({
        top: y, 
        left: x, 
        height: height,
        width: width ,
        backgroundColor: "red"
    })

})