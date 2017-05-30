declare
  cursor student is
     select student_id, major_id, s_admission_fee,s_tuition
     from student_tuition; 
  m_in    MAJOR_INCOME.INCOME%TYPE;
  d_id    MAJOR_INCOME.DEPT_ID%TYPE;
  
begin
 for student_list in student loop
    dbms_output.put_line('dept_id: '||student_list.major_id);
    select dept_id, income
    into d_id,m_in
    from major_income
    where upper(dept_id) = upper(student_list.major_id);
 
    update major_income
    set income = income+student_list.s_admission_fee+(student_list.s_tuition/2)
    where DEPT_ID = student_list.major_id;
  end loop;
  exception
    when others then
      dbms_output.put_line(sqlerrm||'error');
end;