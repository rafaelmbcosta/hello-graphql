import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid';
// type definition

// Scalar Type: String, Boolean, Int, Float, ID

const users = [{
    id: '1',
    name: 'Rafael',
    email: 'rafael@test.com',
    posts: ['10', '11']
  },
  {
    id: '2',
    name: 'Paulo',
    email: 'paulo@test.com',
    posts: ['12']
  },
  {
    id: '3',
    name: 'Marina',
    email: 'marina@test.com',
    posts: []
  }
]

const posts = [
  {
    id: '10',
    title: 'Test 1',
    body: 'Is this going to work ?',
    published: true,
    author: '1'
  },  {
    id: '11',
    title: 'Test 12',
    body: 'Is this going to work ?',
    published: true,
    author: '1'
  },
  {
    id: '12',
    title: 'Test 13',
    body: 'Is this going to work ?',
    published: true,
    author: '2'
  }
]

const typeDefs = `
  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
  }

  type Query {
    posts: [Post!]!
    users: [User!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    createPost(title: String!, body: String!, published: Boolean, author: ID!): Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int,
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`
// Resolvers
const resolvers = {
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email)
      if (emailTaken) {
        throw new Error('Email is already in use')
      }

      const user = {
        id: uuidv4(),
        ...args.data
      }

      users.push(user)
      console.log(users)
      return user
    },
    createPost(parent, args, ctx, info) {
      const userExist = users.some(user => user.id === args.author)

      if (!userExist) {
        throw new Error('User not found')
      }
      console.log(args)
      const post = {
        id: uuidv4(),
        ...args.data
      }

      posts.push(post)
      return post
    }
  },
  Query: {
    users(parent, args, ctx, info) {
      return users
    },

    posts(parent, args, ctx, info) {
      return posts
    },
    me() {
      return {
        id: '123456',
        name: 'Paulo',
        email: 'paulo@teste.com'
      }
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => parent.posts.includes(post.id))
    }
  },
  Post: {
    //parent é o post
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up !')
})