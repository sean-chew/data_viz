################################################################################
###   Author: Sean Chew
###   PURPOSE:
################################################################################

### Set Environment ------------------------------------------------------------
# Clear the environment
rm(list=ls())
gc()
# So the code will compile warnings as per usual
options(warn = 0)
# So that text data is not read in as factors
options(stringsAsFactors = F)
# Turn off scientific notation
options(scipen = 999)
### Load Packages --------------------------------------------------------------

if(!require("pacman")) install.packages("pacman")
pacman::p_load(dplyr, magrittr, stringr, reshape2, janitor,
lubridate, readxl, ggplot2, scales, readr,
tidyr, zoo, skimr, openxlsx,ggspatial, rgeos,RColorBrewer,
tidyverse, rio, collapse, sf, glue, XML, tm, here, purrr, repurrrsive,
tmap,tidygraph, nabor,igraph, viridis, hrbrthemes,RSocrata,soql,ggmap,
geojsonsf)

### Begin Code -----------------------------------------------------------------

options(scipen = 100)

storefronts <- read_csv("./data/Storefronts_Reported_Vacant_or_Not.csv") %>% 
    filter(!is.na(LATITUDE),
           !is.na(LONGITUDE),
           LATITUDE > 0,
           LONGITUDE < 0) 


storefronts_sf <- st_as_sf(storefronts,coords = c("LONGITUDE","LATITUDE")) %>% 
    clean_names() %>% 
    st_set_crs(4326) %>% st_transform(3857)

storefronts_by_halfyear <- storefronts_sf %>% 
    filter(vacant_on_12_31 == "YES" | vacant_6_30_or_date_sold_if_earlier == "YES") %>% 
    mutate(vacant_6_30_or_date_sold_if_earlier = 
               ifelse(is.na(vacant_6_30_or_date_sold_if_earlier),"NO",
                      vacant_6_30_or_date_sold_if_earlier))

storefronts_2020_1 <- storefronts_by_halfyear %>% # 6165 units vacant
    filter(vacant_on_12_31 == "YES" & reporting_year == "2019 and 2020") 

# I don't think this is actually a good way to account for it.
# storefronts_2020_2 <- storefronts_by_halfyear %>% # 6165 units vacant 
#     filter(vacant_6_30_or_date_sold_if_earlier == "YES" & reporting_year == "2019 and 2020") 
# 

storefronts_2021_1 <- storefronts_by_halfyear %>% # 7614 units vacant
    filter(vacant_on_12_31 == "YES" & reporting_year == "2020 and 2021") 

# storefronts_2021_2 <- storefronts_by_halfyear %>% # 6165 units vacant # 3378
#     filter(vacant_6_30_or_date_sold_if_earlier == "YES" & reporting_year == "2020 and 2021") 

#write_sf(storefronts_2020_1,"./intermediate/for_heatmap/storefronts_2020.shp")
#write_sf(storefronts_2021_1,"./intermediate/for_heatmap/storefronts_2021.shp")

geo_2020 <- sf_geojson(storefronts_2020_1)
geo_2021 <- sf_geojson(storefronts_2020_2)

# ggmap(storefronts_2021_1, extent = 'device', legend = "topleft") +
#     geom_density_2d_filled(data = storefronts_2021_1, alpha = 0.3)

#### Exploratory Data Analysis

NTA <- read_sf("./data/NTA map/geo_export_32c56777-0bc5-48c7-9917-05b5a42c7b84.shp")%>% 
    st_transform(3857)

# set defaults for the basemap
set_defaults(map_service = "carto", map_type = "dark")
nyc_raster<-basemap_raster(storefronts_sf)
nyc_raster

tmap_mode("plot")

tm_shape(nyc_raster)+
    tm_rgb() +
    tm_shape(storefronts_sf) +
    tm_dots(col = "primary_business_activity") +
    tm_facets(by = "reporting_year")

ggplot(storefronts_sf %>% st_drop_geometry(),aes(x=as.factor(primary_business_activity) )) +
    geom_bar() +
    coord_flip() +
    facet_grid(cols = vars(reporting_year))

storefronts_varisa <- storefronts_sf %>% 
    st_drop_geometry() %>% 
    mutate(primary_business_activity = ifelse(primary_business_activity == "HEALTH CARE or SOCIAL ASSISTANCE",
                                              "HEALTH CARE OR SOCIAL ASSISTANCE",
                                              primary_business_activity)) %>% 
    group_by(reporting_year,primary_business_activity) %>% 
    count()

ggplot(storefronts_varisa,aes(x=primary_business_activity,y = n)) +
    geom_bar(stat ="identity") +
    coord_flip() +
    facet_grid(cols = vars(reporting_year))

#write_csv(storefronts_varisa,"./Data/clean_storefronts.csv")

tm_shape(NTA) +
    tm_polygons()
 
####
 storefronts_sf_yes_1 <- storefronts_sf %>%
     filter(reporting_year == "2019 and 2020") %>% 
     group_by(nta) %>% 
     summarise(vacant = sum(vacant_on_12_31 == "YES"),
               total_2020 = sum(vacant_on_12_31 == "NO" | vacant_on_12_31 == "YES")) 
 # %>% 
 #     ungroup() %>% 
 #     mutate(perc_1 = vacant/total)
 
storefronts_sf_yes_2 <- storefronts_sf %>%
     filter(reporting_year == "2020 and 2021") %>% 
     group_by(nta) %>% 
     summarise(vacant = sum(vacant_on_12_31 == "YES"),
               total_2021 = sum(vacant_on_12_31 == "NO" | vacant_on_12_31 == "YES"))
#%>% 
     # ungroup() %>% 
     # mutate(perc_2 = vacant/total)
 
storefronts_all <- storefronts_sf_yes_1 %>% 
     st_drop_geometry() %>% 
     left_join(storefronts_sf_yes_2, by = "nta") %>% 
     mutate(change = (total_2021 - total_2020))
 
storefront_change <- NTA %>% 
    left_join(storefronts_all, by = c("ntacode" = "nta"))


storefronts_sf_2020 <- storefronts_sf %>% 
    filter(reporting_year == "2019 and 2020",
           vacant_on_12_31 == "YES") 
storefronts_sf_2021 <- storefronts_sf %>% 
    filter(reporting_year == "2020 and 2021",
           vacant_on_12_31 == "YES") 

tmap_mode("view")

tm_shape(storefront_change) + 
    tm_polygons(col = "change", style = "jenks", palette = "OrRd", alpha = .3,
                lwd = .3) + 
    tm_shape(storefronts_sf_2020) + 
    tm_dots(col = "blue") +
    tm_shape(storefronts_sf_2021) + 
    tm_dots(col = "darkblue")

storefront_change_small <- storefront_change %>% 
    select(c("ntaname","change"))
