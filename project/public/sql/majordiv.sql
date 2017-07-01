create table major_per_student (student_id VARCHAR(10), first_major VARCHAR(10), double_major VARCHAR(10), sub_major VARCHAR(10), primary key(student_id));
delimiter $$
drop procedure if exists majordiv$$
create procedure majordiv()
begin
	declare done int default false ;
    declare s_id varchar(10);
    declare m_id varchar(10);
    declare m_class varchar(10);
    declare idx cursor for select student_id, major_id, major_class from 전공선택_2015_1학기;
    declare continue handler for not found set done = 1;
    
    open idx;
    repeat
		fetch idx into s_id, m_id, m_class;
        if m_class='제1전공' then
			insert into major_per_student(student_id, first_major) values (s_id, m_id)
            on duplicate key update first_major = m_id;
        end if;
        if m_class='복수전공' then
			insert into major_per_student(student_id, double_major) values (s_id, m_id)
            on duplicate key update double_major = m_id;
        end if;
        if m_class='부전공' then
			insert into major_per_student(student_id, sub_major) values (s_id, m_id)
            on duplicate key update sub_major = m_id;
        end if;
	until done end repeat;
    
    close idx;
end$$

delimiter ;