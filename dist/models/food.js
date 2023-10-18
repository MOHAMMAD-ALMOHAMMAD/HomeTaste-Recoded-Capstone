'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = require('mongoose');
// dont use strings as keys or eslint will cause an error, just assign a key to a string instead
var Categories;
(function (Categories) {
  Categories['Pizza'] = 'Pizza';
  Categories['Doner'] = 'Doner';
  Categories['Cig_Kofte'] = '\u00C7i\u011F K\u00F6fte';
  Categories['Dessert'] = 'Dessert';
  Categories['Turkish'] = 'Turkish';
  Categories['Chicken'] = 'Chicken';
  Categories['Fast_Food'] = 'Fast Food';
  Categories['Burger'] = 'Burger';
  Categories['Kumpir'] = 'Kumpir';
  Categories['Meat'] = 'Meat';
  Categories['Italian'] = 'Italian';
  Categories['Healthy'] = 'Healthy/Diet';
  Categories['Drinks'] = 'Drinks';
  Categories['Far_East'] = 'Far East';
  Categories['Vegan'] = 'Vegan';
  Categories['Keto'] = 'Keto';
})(Categories || (Categories = {}));
// dont use strings as keys or eslint will cause an error, just assign a key to a string instead
var Allergies;
(function (Allergies) {
  Allergies['Dairy'] = 'Dairy';
  Allergies['Eggs'] = 'Eggs';
  Allergies['Seafood'] = 'Seafood';
  Allergies['Gluten'] = 'Gluten';
  Allergies['Peanuts'] = 'Peanuts';
  Allergies['Soy'] = 'Soy';
  Allergies['Sesame'] = 'Sesame';
  Allergies['Corn'] = 'Corn';
  Allergies['Meat'] = 'Meat';
  Allergies['Chicken'] = 'Chicken';
  Allergies['Potatoes'] = 'Potatoes';
  Allergies['Rice'] = 'Rice';
  Allergies['Oats'] = 'Oats';
  Allergies['Barley'] = 'Barley';
  Allergies['Rye'] = 'Rye';
  Allergies['Sorghum'] = 'Sorghum';
})(Allergies || (Allergies = {}));
const foodSchema = new mongoose_1.Schema(
  {
    cookerId: {
      type: mongoose_1.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    description: { type: String, maxlength: 256 },
    price: {
      type: Number,
      required: true,
      validate: {
        validator(value) {
          return value > 0;
        },
        message: 'Price must be a positive number',
      },
    },
    image: { type: String, required: true },
    categories: [{ type: String, enum: Object.values(Categories) }],
    allergies: [{ type: String, enum: Object.values(Allergies) }],
  },
  { timestamps: true }
);
const Food = (0, mongoose_1.model)('Food', foodSchema);
exports.default = Food;
