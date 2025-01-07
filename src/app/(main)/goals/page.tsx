import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

enum Tab {
  yearly = "yearly",
  q1 = "q1",
  q2 = "q2",
  q3 = "q3",
  q4 = "q4",
}

const Goals = () => {
  return (
    <div>
      <Tabs defaultValue={Tab.yearly}>
        <TabsList>
          <TabsTrigger value={Tab.yearly}>Yearly</TabsTrigger>
          <TabsTrigger value={Tab.q1}>Q1</TabsTrigger>
          <TabsTrigger value={Tab.q2}>Q2</TabsTrigger>
          <TabsTrigger value={Tab.q3}>Q3</TabsTrigger>
          <TabsTrigger value={Tab.q4}>Q4</TabsTrigger>
        </TabsList>
        <TabsContent value={Tab.yearly}>
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">Yearly Goals</h2>
            <p>
              These are the goals that you want to achieve by the end of the
              year. Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Illo minus soluta voluptates eius ea nam totam dolores porro, iure
              dolorum nostrum ipsum consequatur, beatae architecto quam
              quibusdam iste sint, impedit ut tenetur doloribus voluptate. Vel
              voluptatem deleniti, ipsam quis magnam at quas ex aperiam! Sed,
              quaerat! Adipisci, quas. Eveniet id itaque assumenda blanditiis
              quaerat nulla officiis cumque soluta, earum alias laborum ad ab
              laboriosam reprehenderit, magni rem vero ducimus. Quam laboriosam
              sequi impedit dolorum quae. Eligendi, nihil, enim sint itaque
              accusamus earum voluptatum temporibus iure possimus excepturi
              fugiat suscipit quo quidem a explicabo maiores veniam ducimus
              aperiam odio aliquam neque laboriosam laudantium. Rerum ex nemo
              quis expedita facilis, nulla mollitia et fuga accusamus.
              Temporibus quibusdam id eligendi perspiciatis? Doloremque qui odio
              quis. Perferendis possimus hic quam soluta necessitatibus dolor
              unde? Neque error ea aliquid numquam iste ut possimus sed
              exercitationem doloremque? Dolorum ab quidem molestias! Iste alias
              error aliquid commodi enim aperiam repellat voluptatum obcaecati
              illo quo nihil animi magnam expedita cupiditate nulla quod labore,
              fugiat sunt corporis inventore earum sint? Aliquid deleniti
              aperiam porro hic repudiandae harum voluptate nostrum natus atque
              dolores numquam officia, rerum quibusdam, non, consectetur
              nesciunt autem perspiciatis vitae. Nobis, unde hic! Dignissimos
              sit sapiente ab. Dignissimos soluta blanditiis nam perspiciatis
              sunt necessitatibus vel doloribus quo consequuntur voluptatibus
              quisquam obcaecati commodi laborum voluptatum ratione sequi, a
              alias reiciendis id porro tempore. Magni animi reprehenderit fugit
              a enim! Deleniti, dolorem quia libero modi nemo sapiente incidunt
              minus ex debitis ratione quisquam omnis nulla fugiat repudiandae
              quos vel, distinctio vero error quam nam rerum aliquid adipisci?
              Deleniti, et nostrum. Voluptates beatae soluta iusto, magni
              architecto tempora expedita eos maiores aut illo aperiam aliquam
              nihil, veniam, sint eveniet quas excepturi perferendis fuga? Alias
              officia adipisci pariatur. Odit at quos incidunt minus temporibus
              quia praesentium, sint repellendus quas officiis ipsam hic nisi,
              deleniti ea. Illo dolores facilis nulla delectus nisi nostrum eos
              dolorem officia repudiandae! Facilis quibusdam provident at nemo
              dolore ut officiis consequatur sint, esse explicabo itaque totam
              numquam libero dicta necessitatibus molestiae cum fugit non sunt
              laborum atque alias ipsum? Autem molestiae impedit consectetur est
              harum reiciendis sapiente saepe nulla. Voluptatem, tenetur
              consectetur vitae veniam perspiciatis labore adipisci at, et fugit
              beatae reiciendis! Ullam numquam tempora facere nihil assumenda,
              corrupti, quod minima officia sint quos provident! Asperiores modi
              aut est culpa autem distinctio nam, optio quis ea esse, corrupti
              rem accusamus, ipsum eius ullam! Cumque ad facere a. Voluptates
              illum eveniet deleniti omnis beatae dolore at totam optio officia
              voluptas perspiciatis minus sequi, debitis, accusantium
              voluptatibus ipsum earum neque quisquam. Nulla, quibusdam officia
              adipisci neque nobis assumenda. Qui, nulla assumenda! Ab expedita
              quaerat dolores ea. Labore repellendus ut et nihil culpa magnam
              nam aut eos illo facere! Fuga, sunt sapiente esse autem voluptas
              voluptatibus explicabo culpa omnis illo animi ut repellendus
              quibusdam dolor quis enim commodi aut rerum at repellat. Minus
              ipsam quibusdam suscipit nobis quam voluptatibus aliquid
              consequatur pariatur in excepturi exercitationem voluptas hic
              ipsum asperiores necessitatibus quo aliquam provident, blanditiis,
              porro illo. Veritatis facilis dicta architecto, sapiente labore
              fugit soluta ducimus nisi facere quos maxime dolorum recusandae?
              Enim temporibus labore velit amet dolor consectetur perferendis
              animi nulla vero doloribus officiis modi maxime alias, odit quia
              adipisci iste sunt saepe voluptatibus reiciendis deleniti fuga
              itaque magni. Sit beatae culpa tenetur voluptatum eum minus
              dignissimos iure fugiat et in totam, non rerum? Veritatis quam quo
              explicabo, aliquid quod autem possimus perferendis, corporis
              placeat at, vero minima esse laudantium distinctio? Esse hic neque
              dolorem id eos quam expedita? Vel fugit nihil commodi distinctio
              dicta excepturi impedit possimus at quod? Odio incidunt molestias
              animi eaque similique hic excepturi sapiente officiis? Neque,
              earum ex fugiat suscipit, eveniet quibusdam provident iste in
              voluptatum quam vitae deleniti. Repellendus amet, a sed, suscipit
              odio sit maiores voluptatum voluptatem ducimus expedita accusamus
              quas labore optio omnis voluptates quis blanditiis. Porro
              consequuntur excepturi suscipit deserunt architecto perspiciatis,
              tempora fugiat magnam neque totam dicta a facere ducimus molestias
              obcaecati repellat voluptatem sapiente similique eveniet voluptas
              rem corporis sunt sit. Obcaecati, quod id ex necessitatibus
              suscipit quisquam pariatur blanditiis nulla tenetur sed debitis
              deserunt, quaerat molestias earum omnis cupiditate nesciunt. Minus
              repellendus quo quis, delectus quod dolores maxime quas ducimus.
              Ad repellendus quibusdam obcaecati veniam voluptates corrupti
              numquam hic cum, aperiam repudiandae, maxime quae unde qui dolore
              saepe illum atque veritatis tempore sint dolorum ipsum aliquam
              temporibus ipsam deleniti! Quidem ea a deserunt. Unde reiciendis
              dolor eveniet doloribus neque rem commodi error beatae soluta
              aliquid est provident, in officia, consequuntur ipsum vero ullam
              quo laudantium facilis saepe laborum corporis culpa voluptatibus!
              Error, animi, voluptas consequatur veritatis velit possimus quas
              aspernatur laudantium nemo enim quos minus officia ipsa mollitia
              dolores! Cumque corrupti ex mollitia dolor rerum similique!
              Obcaecati libero labore laudantium odio eos, blanditiis reiciendis
              tempore aperiam. Officia eos sapiente cupiditate dignissimos
              pariatur incidunt praesentium in quaerat quisquam nam?
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if
                you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;
