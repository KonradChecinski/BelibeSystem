import React, {useMemo} from 'react'

import CustomSelect from '../components/CustomSelect'
import {HoursProps} from '../types'
import {DEFAULT_LOCALE_EN} from '../locale'
import {classNames} from '../utils'
import {UNITS} from '../constants'
import {Box, Typography} from "@mui/material"

export default function Hours(props: HoursProps) {
    const {
        value,
        setValue,
        locale,
        className,
        disabled,
        readOnly,
        leadingZero,
        clockFormat,
        period,
        ...selectProps
    } = props
    const internalClassName = useMemo(
        () =>
            classNames({
                'react-js-cron-field': true,
                'react-js-cron-hours': true,
                [`${className}-field`]: !!className,
                [`${className}-hours`]: !!className,
            }),
        [className]
    )

    return (
        <Box className={internalClassName}
             sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 2}}>
            {locale.prefixHours !== '' && (
                <Typography>{locale.prefixHours || DEFAULT_LOCALE_EN.prefixHours}</Typography>
            )}

            <CustomSelect
                placeholder={locale.emptyHours || DEFAULT_LOCALE_EN.emptyHours}
                value={value}
                unit={UNITS[1]}
                setValue={setValue}
                locale={locale}
                className={className}
                disabled={disabled}
                readOnly={readOnly}
                leadingZero={leadingZero}
                clockFormat={clockFormat}
                period={period}
                {...selectProps}
            />
        </Box>
    )
}
