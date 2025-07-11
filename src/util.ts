import { PipelineStage } from 'mongoose'
import { PaginationFilter } from './data'

export interface DecodedIdToken {
    /**
     * The audience for which this token is intended.
     *
     * This value is a string equal to your Firebase project ID, the unique
     * identifier for your Firebase project, which can be found in [your project's
     * settings](https://console.firebase.google.com/project/_/settings/general/android:com.random.android).
     */
    aud: string
    /**
     * Time, in seconds since the Unix epoch, when the end-user authentication
     * occurred.
     *
     * This value is not set when this particular ID token was created, but when the
     * user initially logged in to this session. In a single session, the Firebase
     * SDKs will refresh a user's ID tokens every hour. Each ID token will have a
     * different [`iat`](#iat) value, but the same `auth_time` value.
     */
    auth_time: number
    /**
     * The email of the user to whom the ID token belongs, if available.
     */
    email?: string
    /**
     * Whether or not the email of the user to whom the ID token belongs is
     * verified, provided the user has an email.
     */
    email_verified?: boolean
    /**
     * The ID token's expiration time, in seconds since the Unix epoch. That is, the
     * time at which this ID token expires and should no longer be considered valid.
     *
     * The Firebase SDKs transparently refresh ID tokens every hour, issuing a new
     * ID token with up to a one hour expiration.
     */
    exp: number
    /**
     * Information about the sign in event, including which sign in provider was
     * used and provider-specific identity details.
     *
     * This data is provided by the Firebase Authentication service and is a
     * reserved claim in the ID token.
     */
    firebase: {
        /**
         * Provider-specific identity details corresponding
         * to the provider used to sign in the user.
         */
        identities: {
            [key: string]: any
        }
        /**
         * The ID of the provider used to sign in the user.
         * One of `"anonymous"`, `"password"`, `"facebook.com"`, `"github.com"`,
         * `"google.com"`, `"twitter.com"`, `"apple.com"`, `"microsoft.com"`,
         * `"yahoo.com"`, `"phone"`, `"playgames.google.com"`, `"gc.apple.com"`,
         * or `"custom"`.
         *
         * Additional Identity Platform provider IDs include `"linkedin.com"`,
         * OIDC and SAML identity providers prefixed with `"saml."` and `"oidc."`
         * respectively.
         */
        sign_in_provider: string
        /**
         * The type identifier or `factorId` of the second factor, provided the
         * ID token was obtained from a multi-factor authenticated user.
         * For phone, this is `"phone"`.
         */
        sign_in_second_factor?: string
        /**
         * The `uid` of the second factor used to sign in, provided the
         * ID token was obtained from a multi-factor authenticated user.
         */
        second_factor_identifier?: string
        /**
         * The ID of the tenant the user belongs to, if available.
         */
        tenant?: string
        [key: string]: any
    }
    /**
     * The ID token's issued-at time, in seconds since the Unix epoch. That is, the
     * time at which this ID token was issued and should start to be considered
     * valid.
     *
     * The Firebase SDKs transparently refresh ID tokens every hour, issuing a new
     * ID token with a new issued-at time. If you want to get the time at which the
     * user session corresponding to the ID token initially occurred, see the
     * [`auth_time`](#auth_time) property.
     */
    iat: number
    /**
     * The issuer identifier for the issuer of the response.
     *
     * This value is a URL with the format
     * `https://securetoken.google.com/<PROJECT_ID>`, where `<PROJECT_ID>` is the
     * same project ID specified in the [`aud`](#aud) property.
     */
    iss: string
    /**
     * The phone number of the user to whom the ID token belongs, if available.
     */
    phone_number?: string
    /**
     * The photo URL for the user to whom the ID token belongs, if available.
     */
    picture?: string
    /**
     * The `uid` corresponding to the user who the ID token belonged to.
     *
     * As a convenience, this value is copied over to the [`uid`](#uid) property.
     */
    sub: string
    /**
     * The `uid` corresponding to the user who the ID token belonged to.
     *
     * This value is not actually in the JWT token claims itself. It is added as a
     * convenience, and is set as the value of the [`sub`](#sub) property.
     */
    uid: string
    /**
     * Other arbitrary claims included in the ID token.
     */
    [key: string]: any
}

export const parseSortString = (stringSort: string): any => {
    if (stringSort[0] === '-') {
        return {
            [stringSort.substring(1, stringSort.length - 1)]: -1,
        }
    } else {
        return {
            [stringSort]: 1,
        }
    }
}

export const parseProjectionString = (stringProjection: string): any => {
    const list = stringProjection.split(' ')

    const projection: { [key: string]: number } = {}
    for (let i = 0; i < list.length; i++) {
        if (list[i][0] === '-') {
            projection[list[i].substring(1, list[i].length - 1)] = -1
        } else {
            projection[list[i]] = 1
        }
    }

    return projection
}

export const aggregationPagination = (
    pagination: PaginationFilter,
    projection?: string
) => {
    const { filter, page, limit, sort } = pagination

    let aggregationPagination: PipelineStage[] = []

    if (filter && Object.keys(filter).length > 0) {
        aggregationPagination.push({
            $match: filter,
        })
    }

    if (sort) {
        aggregationPagination.push({
            $sort: parseSortString(sort),
        })
    }

    aggregationPagination = aggregationPagination.concat([
        {
            $facet: {
                totalCount: [{ $count: 'value' }],
                pipelineResults: projection
                    ? [
                          {
                              $project: parseProjectionString(projection),
                          },
                      ]
                    : [],
            },
        },
        {
            $unwind: {
                path: '$pipelineResults',
            },
        },
        {
            $unwind: {
                path: '$totalCount',
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        '$pipelineResults',
                        { totalCount: '$totalCount.value' },
                    ],
                },
            },
        },
    ])

    if (page - 1 > 0) {
        aggregationPagination.push({
            $skip: (page - 1) * limit,
        })
    }

    if (limit > 0) {
        aggregationPagination.push({
            $limit: limit,
        })
    }

    return aggregationPagination
}

export const checkProjection = (entity: string, stringProjection: string) => {
    const list = stringProjection.split(' ')

    return (
        list.length === 0 ||
        list.some((project) => project.includes(entity + '.'))
    )
}
