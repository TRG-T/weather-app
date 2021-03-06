import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "styles/Home.module.scss";
import { Heading } from "components/atoms/Heading/Heading";
import { WeatherForecast } from "components/organisms/WeatherForecast/WeatherForecast";
import { CurrentWeather } from "components/molecules/CurrentWeather/CurrentWeather";
import { WeatherMoreInfo } from "components/organisms/WeatherMoreInfo/WeatherMoreInfo";
import { WeatherContext } from "context";
import Image from "next/image";
import searchLoupe from "public/loupe.svg";
import geoSvg from "public/gps.svg";
import { Paragraph } from "components/atoms/Paragraph/Paragraph";

/*eslint no-undef: "off"*/
const apiKey = process.env.apiKey;

export default function Home() {
    const [weather, setWeather] = useState();
    const [geoSupport, setGeoSupport] = useState(true);
    const [geoError, setGeoError] = useState(false);
    const [anyError, setAnyError] = useState(false);

    const getWeather = (city) => {
        fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=2`
        )
            .then((response) => {
                if (!response.ok) {
                    setAnyError(true);
                    throw new Error(response.error);
                }
                return response.json();
            })
            .then((response) => {
                setWeather(response);
                setAnyError(false);
                // console.log(response);
            });
    };

    const getGeo = () => {
        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const geolocation = `${latitude},${longitude}`;

            getWeather(geolocation);
        }

        function error() {
            setGeoError(true);
        }

        if (!navigator.geolocation) {
            setGeoSupport(false);
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    };

    const validationSchema = Yup.object().shape({
        city: Yup.string()
            .min(3, "Not enough characters")
            .max(20, "Too many characters")
            .required("City field is required"),
    });

    const formik = useFormik({
        initialValues: {
            city: "",
        },
        validationSchema,
        onSubmit: (values) => {
            getWeather(values.city);
            formik.resetForm();
        },
    });

    return (
        <div className={styles.wrapper}>
            <Heading isBig>Weather</Heading>
            <div className={styles.form}>
                <form onSubmit={formik.handleSubmit}>
                    <input
                        placeholder="city"
                        id="city"
                        name="city"
                        type="city"
                        onChange={formik.handleChange}
                        className={styles.input}
                        value={formik.values.city}
                    />
                    <button type="submit" className={styles.submit}>
                        <Image
                            alt="searchButton"
                            width={18}
                            height={18}
                            src={searchLoupe}
                        />
                    </button>
                </form>
                <button className={styles.submitGeo} onClick={() => getGeo()}>
                    <Image
                        alt="geoButton"
                        width={20}
                        height={20}
                        src={geoSvg}
                    />
                </button>
            </div>
            { !geoSupport && <Paragraph isBig>Your browser don&apos;t support geolocation</Paragraph> }
            { geoError && <Paragraph isBig>Unable to get localization</Paragraph> }
            { anyError && <Paragraph isBig>An error occurred, please try again or reload the page</Paragraph> }
            <Paragraph>{formik.errors.city}</Paragraph>

            <div className={styles.weather}>
                {weather && weather.current && (
                    <>
                        <CurrentWeather weather={weather} />
                        <WeatherContext.Provider value={weather}>
                            <WeatherForecast />
                            <WeatherMoreInfo />
                        </WeatherContext.Provider>
                    </>
                )}
            </div>
        </div>
    );
}
