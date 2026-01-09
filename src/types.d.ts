declare global {
  /**
 *IBase: a type to represent generic data that all of the mongoDB documents contain
 @property {string} _id: a mongoDB object id that can help fetch documents.
 @property {string} createdAt: a timestamp that represent date and time of the document creation.
 @property {string} updated_at: a timestamp that represnt date and time of the document last update.
 */
  interface IBase {
    _id: string;
    createdAt: string;
    updated_at?: string;
  }
  /**
   * Represents a IUser document with accessable fields in the backend
   */
  interface IUser extends IBase {
    username: string;
    isEmailVerfied: boolean;
    avatar: string;
    fullname: string;
    description: string;
    email: string;
    recentlyWatchedTags?: string[];
    watchHistory?: string[];
    subscribersCount: number;
    isProfileComplete?: boolean;
  }
  /**
   * Represents a IVideo document with accessable fields in the backend
   */

  interface IVideo extends IBase {
    videoFile: string;
    thumbnail: string;
    title: string;
    duration: number;
    isSubscribed: boolean;
    duration: string;
    views: number;
    owner: Pick<IUser, "_id" | "avatar" | "username" | "subscribersCount">;
    isPublished: boolean;
    tags: string[];
    likesCount: number;
    subscriberCount: number;
    isLiked: boolean;
  }
  /**
   * Represents a channel document with accessable fields in the backend
   */
  interface IChannel extends IUser {
    videos: IVideo[];
    subscribersCount: number;
    channelsSubscribedToCount: number;
    isSubscribed: boolean;
  }

  /**
   * Represents a IPlaylist document with accessable fields in the backend
   */
  interface IPlaylist extends IBase {
    videos: IVideo[];
    name: string;
    description: string;
    owner: string;
    view: number;
    cover: string;
  }

  /**
   * A generic template to represent data received from the backend.
   *
   * @template resType - The type of data expected from the backend response.
   *
   * @property {number} statusCode - The HTTP status code (e.g., 200, 400, 500).
   * @property {resType} data - The expected response data.
   * @property {string} message - The message string sent by the backend.
   */
  interface ApiResponse<resType> {
    statusCode: number;
    data: resType;
    message: string;
  }
  interface ILike extends IBase {
    likedBy: string;
    comment?: string;
    video?: string;
  }
  interface IComment extends IBase {
    content: string;
    owner: Pick<IUser, "_id" | "avatar" | "username">;
    commentId?: string;
    videoId: string;
    likesCount: number;
    isLiked: boolean;
  }

  export interface IPaginatedBase {
    totalPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage?: number;
    prevPage?: number;
  }
  export interface IPaginatedVideos extends IPaginatedBase {
    Videos: IVideo[];
  }
  export interface IWatchHistory {
    _id: string;
    thumbnail: string;
    title: string;
    views: number;
    duration: number;
    owner: {
      _id: string;
      avatar: string;
      username: string;
      subscribersCount: number;
    };
  }
}

export {};
