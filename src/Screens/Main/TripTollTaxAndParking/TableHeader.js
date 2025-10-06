import { View, Text } from "react-native";
import React from "react";
import { styles } from "./style";

export default function TableHeader({ title, parking }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingHorizontal: 10,
        height: 40,
      }}
    >
      <View
        style={{
          width: "21%",
        }}
      >
        {parking ? (
          <Text style={styles.tableListText}>Parking Name</Text>
        ) : (
          <Text style={styles.tableListText}>Toll Name</Text>
        )}
      </View>
      <View
        style={{
          width: "21%",
        }}
      >
        <Text style={styles.tableListText}>Receipt</Text>
      </View>
      <View
        style={{
          width: "21%",
        }}
      >
        <Text style={styles.tableListText}>Price</Text>
      </View>
      <View
        style={{
          width: "12%",
        }}
      >
        <Text style={styles.tableListText}>Status</Text>
      </View>

      <View style={{ width: "21%" }}>
        <Text style={styles.tableListText}>Date</Text>
      </View>
    </View>
  );
}
