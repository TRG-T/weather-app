import React, { useContext } from 'react';
import Image from "next/image";
import styles from './WeatherInfoItem.module.scss';
import { Paragraph } from 'components/atoms/Paragraph/Paragraph';
import { WeatherContext } from "context";

const WeatherInfoItem = ({ imageSource, type, unit }) => {
    const weather = useContext(WeatherContext);
    return (
        <div className={styles.wrapper}>
            <Image alt="weather" width={38} height={38} src={imageSource} />
            <Paragraph>{ unit ? `${weather.current[type]} ${unit}` : `${weather.current[type]}`}</Paragraph>
        </div>
    );
};

export { WeatherInfoItem };
