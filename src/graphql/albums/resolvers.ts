import {
  Resolvers,
  AlbumCover,
  MediaStream,
  MyAlbums,
} from '../../graphql-types'
import { authenticate } from '../auth'
import { RequestWithUser } from '../../utils/RequestWithUser'
import { image } from 'faker'
import { albums, sharedAlbums } from './mock-data'

export const resolvers: Resolvers = {
  Query: {
    myAlbums: async (root, { limit }, { req }, info): Promise<MyAlbums> => {
      const user = await authenticate(req as RequestWithUser)
      return {
        stream: {
          cover: image.imageUrl(600, 600, undefined, true, true),
          mediaCount: 256,
        },
        albums: albums(limit ? limit : undefined, user),
      }
    },

    sharedAlbums: async (
      root,
      { limit },
      { req },
      info
    ): Promise<AlbumCover[]> => {
      await authenticate(req as RequestWithUser)
      return sharedAlbums(limit ? limit : undefined)
    },
  },
}
