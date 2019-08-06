import {
  Resolvers,
  AlbumCover,
  MediaStream,
  MyAlbums,
} from '../../graphql-types'
import { authenticate } from '../auth'
import { RequestWithUser } from '../../utils/RequestWithUser'

const dummyData: AlbumCover[] = [
  {
    id: '123',
    mediaCount: 6,
    slug: 'test-1-123456',
    title: 'Test 1',
    cover: 'https://via.placeholder.com/600',
    owner: {
      id: '5d417467d4ebf1405b15fd63',
      name: 'David',
      email: 'david@stenstroem.dk',
      createdAt: new Date('2019-07-31T10:58:47.145Z'),
      updatedAt: new Date('2019-07-31T10:58:47.146Z'),
    },
    isPrivate: false,
  },
  {
    id: '1234',
    mediaCount: 9,
    slug: 'test-2-123456',
    title: 'Test 2',
    cover: 'https://via.placeholder.com/600',
    owner: {
      id: '5d417467d4ebf1405b15fd63',
      name: 'David',
      email: 'david@stenstroem.dk',
      createdAt: new Date('2019-07-31T10:58:47.145Z'),
      updatedAt: new Date('2019-07-31T10:58:47.146Z'),
    },
    isPrivate: false,
  },
  {
    id: '1235',
    mediaCount: 4,
    slug: 'test-3-123456',
    title: 'Test 3',
    cover: 'https://via.placeholder.com/600',
    owner: {
      id: '5d417467d4ebf1405b15fd63',
      name: 'David',
      email: 'david@stenstroem.dk',
      createdAt: new Date('2019-07-31T10:58:47.145Z'),
      updatedAt: new Date('2019-07-31T10:58:47.146Z'),
    },
    isPrivate: true,
    sharedWith: ['5d43ef27d4ebf1405b15fd64', '5d43ef32d4ebf1405b15fd65'],
  },
  {
    id: '1236',
    mediaCount: 10,
    slug: 'shared-1-123456',
    title: 'Shared 1',
    cover: 'https://via.placeholder.com/600',
    owner: {
      id: '5d43ef32d4ebf1405b15fd65',
      name: 'David3',
      email: 'david3@stenstroem.dk',
      createdAt: new Date('2019-08-02T08:07:14.337Z'),
      updatedAt: new Date('2019-08-02T08:07:14.337Z'),
    },
    isPrivate: true,
    sharedWith: ['5d43ef27d4ebf1405b15fd64', '5d417467d4ebf1405b15fd63'],
  },
]

export const resolvers: Resolvers = {
  Query: {
    // myAlbums: async (root, args, { req }, info): Promise => {
    //   const user = await authenticate(req as RequestWithUser)
    //   const albums = dummyData.filter(
    //     (cover): boolean => cover.owner.id == (user._id as string)
    //   )
    //   console.log(albums)
    //   return albums
    // },
    myAlbums: async (root, args, { req }, info): Promise<MyAlbums> => {
      const user = await authenticate(req as RequestWithUser)
      return {
        stream: {
          mediaCount: 25,
          cover: 'https://via.placeholder.com/600',
        },
        albums: dummyData.filter(
          (cover): boolean => cover.owner.id == (user._id as string)
        ),
      }
    },
    sharedAlbums: async (root, args, { req }, info): Promise<AlbumCover[]> => {
      await authenticate(req as RequestWithUser)
      return [
        {
          id: '1235',
          mediaCount: 4,
          slug: 'test-3-123456',
          title: 'Test 3',
          cover: 'https://via.placeholder.com/600',
          owner: {
            id: '5d417467d4ebf1405b15fd63',
            name: 'David',
            email: 'david@stenstroem.dk',
            createdAt: new Date('2019-07-31T10:58:47.145Z'),
            updatedAt: new Date('2019-07-31T10:58:47.146Z'),
          },
          isPrivate: true,
          sharedWith: ['5d43ef27d4ebf1405b15fd64', '5d43ef32d4ebf1405b15fd65'],
        },
        {
          id: '1236',
          mediaCount: 10,
          slug: 'shared-1-123456',
          title: 'Shared 1',
          cover: 'https://via.placeholder.com/600',
          owner: {
            id: '5d43ef32d4ebf1405b15fd65',
            name: 'David3',
            email: 'david3@stenstroem.dk',
            createdAt: new Date('2019-08-02T08:07:14.337Z'),
            updatedAt: new Date('2019-08-02T08:07:14.337Z'),
          },
          isPrivate: true,
          sharedWith: ['5d43ef27d4ebf1405b15fd64', '5d417467d4ebf1405b15fd63'],
        },
      ]
    },
  },
}
