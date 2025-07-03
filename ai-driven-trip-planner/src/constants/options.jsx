export const SelectTravelsList = [
    {
      id: 1,
      title: 'Just Me',
      desc: 'A sole traveler in exploration',
      icon: '👤',
      people: '1',
    },
    {
      id: 2,
      title: 'A Couple',
      desc: 'Two travelers in tandem',
      icon: '🍷',
      people: '2 People',
    },
    {
      id: 3,
      title: 'Family',
      desc: 'A group of fun-loving adventurers',
      icon: '👨‍👩‍👧‍👦',
      people: '3 to 5 People',
    },
    {
      id: 4,
      title: 'Friend',
      desc: 'A companion for your travels',
      icon: '👯‍♂️',
      people: '1 or more Friends',
    },
  ]
  



  export const SelectBudgetOptions = [
    {
      id: 1,
      title: 'Cheap',
      desc: 'Stay conscious of costs',
      icon: '💸',
    },
    {
      id: 2,
      title: 'Moderate',
      desc: 'Keep cost on the average side',
      icon: '💰',
    },
    {
      id: 3,
      title: 'Luxury',
      desc: 'Spend freely for premium experiences',
      icon: '🪙',
    },
  ]
  

  export const AI_PROMPT =  `Generate Travel Plan for Location: {location}, for {totalDays} Days for {travelers} with a {budget} budget. 
Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions 
and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, 
Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.`;




