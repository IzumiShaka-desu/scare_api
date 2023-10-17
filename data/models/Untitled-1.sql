DELIMITER  //
CREATE FUNCTION  geodistm  
(lat1  DOUBLE ,  lon1  DOUBLE,  lat2 DOUBLE ,  lon2 DOUBLE) 
RETURNS  DOUBLE
BEGIN
 DECLARE pi, q1, q2, q3 DOUBLE;
 DECLARE rads DOUBLE DEFAULT 0;
 SET pi = PI();
 SET lat1 = lat1 * pi / 180;
 SET lon1 = lon1 * pi / 180;
 SET lat2 = lat2 * pi / 180;
 SET lon2 = lon2 * pi / 180;
 SET q1 = COS(lon1-lon2);
 SET q2 = COS(lat1-lat2);
 SET q3 = COS(lat1+lat2);
 SET rads = ACOS( 0.5*((1.0+q1)*q2 - (1.0-q1)*q3) ); 
 RETURN 6378140 * rads;
END //

