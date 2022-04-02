## Weather Dashboard - Homework 6

## Description

## Table of Contents
- [Application](#Application)
- [HTML Layout](#html)
- [CSS Grid](#css)
- [](#)
- [](#)
- [](#)
- [Tests](#tests)
- [Link](#link)

## Application

The user story highlighted a traveler that wants to see the weather forecast for multiple to assist travel planning. The acceptance criteria included a page load that presents a weather dashboard with form inputs. The search input for a city should present the current and future conditions within that city as well as add the city to the search history. When viewing the current weather conditions the user should be presented with the city name, the date, an icon weather representation, the temperature, humidity, wind speed and UV index. The UV index should be color coded based on a favorable, moderate, or severe value. The future weather should be presented as a 5-day forecase that displays the date, an icon representation of the weather, the temperature, wind speed, and humidity. Finally, when the city is clicked on in the search history then the browser should present the weather again. 

## HTML

To create the initial layout of the page, I created a container to hold all of the page content so I could format it with a CSS grid. Within the container I held the header, the sidebar, the current weather container, five containers for the 5-day forecast and a footer. Within the sidebar I created the search input field where the user could type in a city name. Above the input field sits a label and asked the user to search for a city. Below the input field sits a submit button and a clear search history button that will clear any buttons created throughout the searches. Below the search history button lies an initially empty container that will hold the search history buttons as the user interacts with the page. Then I placed a spot for the current weather with two sections for the header of the current weather and the weather content. Then I added a section divider to label the 5-day forecast and added five different holders for five-day weather content. Finally, I added a footer to hold a fun quote and credit the openweathermap.com API source. 

## CSS

The CSS holds all of the color and styling for the page as well as creates the grid layout of the page. After drawing up the different portions of the page I determined there were 5 rows and 6 columns so I laid out the grid as such, applying different grid areas to different portions of the HTML. I formatted all the different background color gradients, font sizes and colors, as well as any necessary padding/margins/borders to create the desired layout that appears when there is no content on the page. 

[Layout with no content present - demonstrating CSS grid layout and color/font/button styling](./assets/images/no_content_layout.png)

I also created three different classes that could added within the javascript file for the uv-index based on severity values (uv-good, uv-okay, and uv-bad). Finally, I created a media screen that changes the CSS grid to a 1 column, 10 row layout when the screen is smaller than 550px. 

## Javascript

## Tests

## Link