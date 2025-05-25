import { StyleSheet, Text, View } from "react-native";

const estrelaCheia = "★";
const estrelaVazia = "☆";

export default function Avaliacao({ nota }: { nota: number }) {
    const max = 5;
    const estrelas = [];

    for (let i = 1; i <= max; i++) {
        estrelas.push(
            <Text key={i} style={styles.star}>
                {i <= nota ? estrelaCheia : estrelaVazia}
            </Text>
        );
    }

    return <View style={{ flexDirection: "row" }}>{estrelas}</View>;
}

const styles = StyleSheet.create({
    star: {
        fontSize: 16,
        color: "#f1c40f",
        marginRight: 2,
    },
});