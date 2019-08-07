import { AlbumCover, User } from '../../graphql-types'
import { random, image, name, internet, date, lorem, helpers } from 'faker'

const generateOwner = (): User => {
  const firstName = name.firstName()
  const lastName = name.lastName()
  return {
    id: random.uuid(),
    email: internet.email(firstName, lastName),
    name: internet.userName(firstName, lastName),
    createdAt: date.past(2),
    updatedAt: date.recent(),
  }
}

const generateSharedWith = (): string[] => {
  const shares = random.number({ max: 10, min: 3 })
  let str: string[] = []
  for (let i = 0; i < shares; i++) {
    str.push(random.uuid())
  }
  return str
}

const generateAlbum = (isPrivate: boolean, owner?: User): AlbumCover => {
  const title = lorem.sentence()
  const slug = helpers.slugify(title)
  return {
    id: random.uuid(),
    mediaCount: random.number({ min: 3, max: 25 }),
    cover: image.imageUrl(600, 600, undefined, true, true),
    isPrivate,
    sharedWith: isPrivate ? generateSharedWith() : null,
    owner: owner ? owner : generateOwner(),
    title,
    slug,
  }
}

export const albums = (limit?: number, owner?: User): AlbumCover[] => {
  let covers: AlbumCover[] = []
  if (limit && limit > 0) {
    for (let i = 0; i < limit; i++) {
      covers.push(generateAlbum(random.boolean(), owner))
    }
    return covers
  }

  for (let i = 0; i < 15; i++) {
    covers.push(generateAlbum(random.boolean(), owner))
  }
  return covers
}

export const sharedAlbums = (limit?: number): AlbumCover[] => {
  const title = lorem.sentence(5)
  const slug = helpers.slugify(title)
  let albums: AlbumCover[] = []
  if (limit && limit > 0) {
    for (let i = 0; i < limit; i++) {
      albums.push(generateAlbum(random.boolean()))
    }
    return albums
  }

  for (let i = 0; i < 15; i++) {
    albums.push(generateAlbum(random.boolean()))
  }
  return albums
}
