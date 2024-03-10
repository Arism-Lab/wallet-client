import siteMetadata from '@/data/siteMetadata.json'
import { register, format } from 'timeago.js'

const localeFunc = (
    diff: number,
    idx: number,
    totalSec?: number
): [string, string] => {
    return [
        ['just now', 'right now'],
        ['%s secs ago', 'in %s secs'],
        ['1 min ago', 'in 1 min'],
        ['%s mins ago', 'in %s mins'],
        ['1 hr ago', 'in 1 hr'],
        ['%s hrs ago', 'in %s hrs'],
        ['1 day ago', 'in 1 day'],
        ['%s days ago', 'in %s days'],
        ['1 wk ago', 'in 1 wk'],
        ['%s wks ago', 'in %s wks'],
        ['1 mo ago', 'in 1 mo'],
        ['%s mos ago', 'in %s mos'],
        ['1 yr ago', 'in 1 yr'],
        ['%s yrs ago', 'in %s yrs'],
    ][idx] as [string, string]
}

export const formatDate = (date: string, relative: boolean = false): string => {
    let now

    if (relative) {
        register(siteMetadata.locale, localeFunc)
        now = format(date, siteMetadata.locale)
    } else {
        now = new Date(date).toLocaleDateString(siteMetadata.locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return now
}
