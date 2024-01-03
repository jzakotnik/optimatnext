const fetcher = async () => {
  const trafficresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/traffic"
  );

  const traffic = await trafficresponse.json();
  //console.log("Traffic API response: ", trafficresponse, traffic);

  const co2response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/co2signal"
  );
  const co2 = await co2response.json();

  const newsresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/spiegelfeed"
  );
  const news = await newsresponse.json();

  const phoneresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/fritz"
  );
  const phone = await phoneresponse.json();
  //console.log("Got phone", phone);

  const calendarresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/calendar"
  );
  const calendar = await calendarresponse.json();

  const fuelresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/fuel"
  );
  const fuel = await fuelresponse.json();

  const weatherresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/weather"
  );
  const weather = await weatherresponse.json();

  const tibberresponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/tibber"
  );
  const tibber = await tibberresponse.json();

  // Pass data to the page via props
  return {
    data: {
      traffic: traffic,
      co2: co2,
      news: news,
      phone: phone,
      calendar: calendar,
      fuel: fuel,
      weather: weather,
      tibber: tibber,
    },
  };
};

export default fetcher;
