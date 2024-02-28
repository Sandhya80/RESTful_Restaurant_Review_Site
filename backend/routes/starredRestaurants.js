const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});
/**
 * Feature 7: Getting a specific starred restaurant. 
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  //Finding the restaurant (with matching id) in the list of restaurants:
  const restaurant = STARRED_RESTAURANTS.find((restaurant) => restaurant.id === id);
  //If the restaurant doesn't exist, send the status code to the client:
  if(!restaurant) {
    res.sendStatus(404);
    return;
  }
  res.json(restaurant);
});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {
  const { body } = req;
  const { id } = body;

  const restaurant = ALL_RESTAURANTS.find((restaurant) => restaurant.id === id);

  if (!restaurant) {
    res.sendStatus(404);
    return;
  }
  // Generate a unique id for the new starred restaurant
  const newId = uuidv4();
  // Create a record for the new starred restaurant
  const newStarredRestaurant = {
    id: newId,
    restaurantId: restaurant.id,
    comment: null
  };
  // Push the new record into STARRED_RESTAURANTS
  STARRED_RESTAURANTS.push(newStarredRestaurant);

  res.status(200).send({
	id: newStarredRestaurant.id,
	comment: newStarredRestaurant.comment,
	name: restaurant.name
  });
})

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const newListOfStarredRestaurants = STARRED_RESTAURANTS.filter(
    (restaurant) => restaurant.id !== id
  )
  // The user tried to unstar a restaurant that isn't currently starred
  if (STARRED_RESTAURANTS.length === newListOfStarredRestaurants.length) {
    res.sendStatus(404);
    return;
  }

  STARRED_RESTAURANTS = newListOfStarredRestaurants;

  res.sendStatus(200)
})

/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { newComment } = req.body;

  const restaurant = STARRED_RESTAURANTS.find((restaurant) => restaurant.id === id);
  
  if (!restaurant) {
    res.sendStatus(404);
    return;
  };

  restaurant.comment = newComment;

  res.sendStatus(200);
})




module.exports = router;