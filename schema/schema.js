const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");
const userModel = require("../model/user");
const jwt = require("jsonwebtoken");

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    jwtToken: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    login: {
      type: userType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args, req, info) {
        const user = await userModel.findOne({
          name: args.username,
          password: args.password,
        });

        const userJwt = jwt.sign({ id: user._id }, "privatekey", {
          expiresIn: 259200000,
        });
        return {
          id: user._id,
          name: user.name,
          password: user.password,
          jwtToken: userJwt,
        };
      },
    },
    users: {
      type: GraphQLList(userType),
      resolve(parent, args, req, info) {
        console.log(req.auth, req.authId);
        if (!req.auth) {
          throw new Error("not auth");
        }
        return userModel.find({}).then((res) => res);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  fields: {
    createUser: {
      type: userType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args, req, info) {
        let user = new userModel({ name: args.name, password: args.password });
        return user.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
