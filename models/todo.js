// models/todo.js
'use strict';
const { Model } = require('sequelize');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static async addTask(params) {
      return  await Todo.create(params);
    }

     static async showList(){
      console.log("Todo List\n");

      console.log("Overdue")
      console.log(
        (await Todo.overdue())
        .map((item) => {
          return item.displayableString()
        }).join("\n")
      );
      console.log("\n");

      console.log("Due Today")
      
      console.log(
        (await Todo.dueToday())
        .map((item) => item.displayableString())
        .join("\n")
      );
      console.log("\n");

      console.log("Due Later")
      console.log(
        (await Todo.dueLater())
        .map((item) => item.displayableString()).join("\n")
      );
      console.log("\n");
     }

     static async overdue(){
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
            completed: false
          },
        },
        order: [["id", "ASC"]]
      });
     }

     static async dueToday(){
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
            
          },
        },
        order: [["id", "ASC"]]
      });
     }

     static async dueLater(){
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
      
          },
        },
        order: [["id", "ASC"]]
      });
     }

     static async markAsComplete(id){
      return Todo.update({
        completed: true
      },
      {
        where: {
          id: id,
        },
      }
      );
     }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`
  }
}
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
