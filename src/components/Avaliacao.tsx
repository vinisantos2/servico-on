import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";


const estrelaCheia = "★";
const estrelaVazia = "☆";

export default function Avaliacao({ idParceiro }: { idParceiro: string }) {
    const [media, setMedia] = useState<number | null>(null);
    console.log(media)
    useEffect(() => {
        const buscarAvaliacoes = async () => {
            try {
                const q = query(
                    collection(db, "avaliacoes"),
                    where("idParceiro", "==", idParceiro)
                );
                const querySnapshot = await getDocs(q);

                let soma = 0;
                let total = 0;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (typeof data.nota === "number") {
                        soma += data.nota;
                        total++;
                    }
                });

                if (total > 0) {
                    setMedia(soma / total);
                } else {
                    setMedia(0);
                }
            } catch (error) {
                console.error("Erro ao buscar avaliações:", error);
            }
        };

        buscarAvaliacoes();
    }, [idParceiro]);

    const max = 5;
    const estrelas = [];

    for (let i = 1; i <= max; i++) {
        estrelas.push(
            <Text key={i} style={styles.star}>
                {media !== null && i <= Math.round(media) ? estrelaCheia : estrelaVazia}
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
