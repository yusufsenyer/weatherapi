import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator } from "react-native";

type WeatherData = {
  city?: string;
  temperature?: number;
  feels_like?: number;
  description?: string;
  error?: string;
};

export default function App() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.56:5000/agent/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: city }),
      });

      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (error) {
      console.error(error);
      setWeather({ error: "Sunucuya bağlanılamadı." });
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Şehir Gir:</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="Örn: Istanbul"
      />
      <Button title="Hava Durumunu Getir" onPress={getWeather} />

      {loading && <ActivityIndicator size="large" color="blue" />}

      {weather && (
        <View style={styles.result}>
          {weather.error ? (
            <Text style={styles.error}>{weather.error}</Text>
          ) : (
            <>
              <Text>🌆 Şehir: {weather.city}</Text>
              <Text>🌡️ Sıcaklık: {weather.temperature}°C</Text>
              <Text>🌤️ Hava: {weather.description}</Text>
              <Text>🤔 Hissedilen: {weather.feels_like}°C</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 18, marginBottom: 12 },
  input: {
    height: 40,
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  result: { marginTop: 20 },
  error: { color: "red" },
});
