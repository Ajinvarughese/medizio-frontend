import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";

type Props = {
    data: number[];       // confidence values 0-100
    height?: number;
};

export default function ProgressLineChart({ data, height = 170 }: Props) {
    const { points, lastX } = useMemo(() => {
        const safe = data.length ? data : [0];

        const padding = 14;
        const width = 320; // chart width reference (we'll scale via flex)
        const h = height;

        const max = 100;
        const min = 0;

        const stepX = safe.length === 1 ? 0 : (width - padding * 2) / (safe.length - 1);

        const pts = safe.map((v, i) => {
            const clamped = Math.max(min, Math.min(max, v));
            const x = padding + i * stepX;
            const y = padding + (h - padding * 2) * (1 - clamped / 100);
            return { x, y };
        });

        return { points: pts, lastX: width };
    }, [data, height]);

    return (
        <View style={[styles.wrap, { height }]}>
            {/* grid lines */}
            <View style={[styles.gridLine, { top: height * 0.2 }]} />
            <View style={[styles.gridLine, { top: height * 0.5 }]} />
            <View style={[styles.gridLine, { top: height * 0.8 }]} />

            {/* draw segments */}
            <View style={styles.canvas}>
                {points.map((p, idx) => {
                    const next = points[idx + 1];
                    if (!next) return null;

                    // compute segment angle + length
                    const dx = next.x - p.x;
                    const dy = next.y - p.y;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

                    return (
                        <View
                            key={"seg-" + idx}
                            style={[
                                styles.segment,
                                {
                                    left: p.x,
                                    top: p.y,
                                    width: len,
                                    transform: [{ rotate: `${angle}deg` }],
                                },
                            ]}
                        />
                    );
                })}

                {/* points */}
                {points.map((p, idx) => (
                    <View
                        key={"pt-" + idx}
                        style={[
                            styles.dot,
                            {
                                left: p.x - 4,
                                top: p.y - 4,
                            },
                        ]}
                    />
                ))}

                {/* last dot highlight */}
                {points.length > 0 && (
                    <View
                        style={[
                            styles.dotBig,
                            {
                                left: points[points.length - 1].x - 7,
                                top: points[points.length - 1].y - 7,
                            },
                        ]}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        width: "100%",
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "rgba(16,42,67,0.04)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        position: "relative",
    },

    gridLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: "rgba(0,0,0,0.04)",
    },

    canvas: {
        flex: 1,
    },

    segment: {
        position: "absolute",
        height: 3,
        backgroundColor: "#37d06d",
        borderRadius: 999,
    },

    dot: {
        position: "absolute",
        width: 8,
        height: 8,
        borderRadius: 99,
        backgroundColor: "#0f2f47",
    },

    dotBig: {
        position: "absolute",
        width: 14,
        height: 14,
        borderRadius: 99,
        backgroundColor: "#37d06d",
        borderWidth: 2,
        borderColor: "#0f2f47",
    },
});
